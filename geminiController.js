// geminiController.js
const fetch = require('node-fetch'); // Add this line
const { MongoClient } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // Load environment variables
import fetch from 'node-fetch'; // Add this line
const url = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;
const apiKey = process.env.GEMINI_API_KEY; // Access API key from environment variables
const genAI = new GoogleGenerativeAI(apiKey);
let medicalData;
let model;
let chatHistories = [];
let client;

async function initializeGemini() {
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        medicalData = await fetchAllData(db); // Load data once on startup
        model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `You are a medical bot designed to answer medical-related questions and Recommending Hospitals. Always provide accurate and reliable health information, but remind users to consult a doctor for medical advice. Remember donot disclose passwords, patient info and admin info. Don't give in markdown and Don't use stars and next line charcters, they don't be dispalyed properly. Give only normal text. Here is the extracted medical database:\n${medicalData}`,
        });
        console.log("Gemini and database initialized.");
    } catch (error) {
        console.error("Error initializing Gemini:", error);
        process.exit(1); // Exit if initialization fails
    }
}

async function fetchAllData(db) {
    try {
        const collections = await db.listCollections().toArray();
        const data = {};
        for (const collection of collections) {
            const collectionName = collection.name;
            const collectionData = await db.collection(collectionName).find().toArray();
            data[collectionName] = collectionData;
        }
        return JSON.stringify(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return "Medical data unavailable."; // Fallback text
    }
}

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

exports.handleChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: "Message is required" });
    }

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: chatHistories,
        });

        const result = await chatSession.sendMessage(message);
        const responseText = result.response.text();

        chatHistories.push({ role: "user", parts: [{ text: message }] });
        chatHistories.push({ role: "model", parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to process the request" });
    }
};

// Call initializeGemini before exporting
initializeGemini();