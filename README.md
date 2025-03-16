# MedReady

A full-stack web application designed to centralize and streamline real-time management and access to hospital emergency equipment and blood bank resources, enhancing operational efficiency and emergency response.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time management of hospital emergency equipment
- Centralized access to blood bank resources
- Enhanced operational efficiency
- Improved emergency response times

## Technologies Used

- React
- Node.js
- MongoDB
- CSS
- JavaScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SrihariSakshith/MedReady.git
   cd MedReady
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_uri
   PORT=5000
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Visit `http://localhost:5000` in your web browser.
2. Use the application to manage hospital emergency equipment and blood bank resources.

## Database Setup

To ensure proper functionality, you need to configure the MongoDB database:

1. **MongoDB Compass Setup:**
   - Connect to your MongoDB instance using MongoDB Compass.
   - Create a new database called `medready`.
   - Within the `medready` database, create the following collections:
     - `equipment`
     - `bloodbank`
     - `users`
   
2. **Data Schema:**

   Here are the sample schemas you can use for each collection:

   - **Equipment Collection:**
     ```json
     {
       "name": "Defibrillator",
       "quantity": 10,
       "location": "Emergency Room",
       "status": "Available"
     }
     ```

   - **Blood Bank Collection:**
     ```json
     {
       "bloodType": "O+",
       "quantity": 5,
       "expiryDate": "2025-12-31",
       "status": "Available"
     }
     ```

   - **Users Collection:**
     ```json
     {
       "username": "admin",
       "password": "hashed_password",
       "role": "admin"
     }
     ```

3. **Insert Initial Data:**
   - Use MongoDB Compass to insert initial data into the collections as per the above schemas.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.
