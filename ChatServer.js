const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const config = require("./config"); // Import config file

const app = express();
const port = 4001;
app.use(cors());
app.use(bodyParser.json());

const apiKey = config.GEMINI_API_KEY; // Use API key from config
const genAI = new GoogleGenerativeAI(apiKey);

const url = "mongodb://localhost:27017/";
const dbName = "MedReady";

async function fetchAllData() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const data = {};

    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionData = await db.collection(collectionName).find().toArray();
      data[collectionName] = collectionData;
    }

    return JSON.stringify(data); // Convert data to string for system instructions
  } catch (error) {
    console.error("Error fetching data:", error);
    return "Medical data unavailable."; // Fallback text
  } finally {
    await client.close();
  }
}

fetchAllData().then((medicalData) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are a medical bot designed to answer medical-related questions and Recommending Hospitals. Always provide accurate and reliable health information, but remind users to consult a doctor for medical advice. Remember donot disclose passwords, patient info and admin info. Don't give in markdown and Don't use stars and next line charcters, they don't be dispalyed properly. Give only normal text. Here is the extracted medical database:\n${medicalData}`,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatHistories = [];

  app.post("/chat", async (req, res) => {
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
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
