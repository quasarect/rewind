console.log("Start#############################################")
const { MongoClient } = require('mongodb');
const fs = require("fs");

// MongoDB connection URL
const url = 'mongodb://root:secret@mongo:27017/rewind-test?authSource=admin';

// Database and collection names
const dbName = 'rewind-test';
let dummyData;

// Dummy data to be inserted
fs.readFile('dummy-database.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        // Parse the JSON data
        dummyData = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

// Connect to MongoDB and insert the data
async function insertData() {
    try {
        console.log("Connecting to the server....");
        // Connect to the MongoDB server
        const client = await MongoClient.connect(url);
        console.log("Connected");
        // Get the database instance
        const db = client.db(dbName);

        // Get the collection
        let collection = db.collection("users");

        // Insert the dummy data

        await collection.insertOne(dummyData.users.user1);
        await collection.insertOne(dummyData.users.user2);

        console.log("Users data inserted successfully");

        collection = db.collection("posts");

        await collection.insertOne(dummyData.posts.post1);
        await collection.insertOne(dummyData.posts.post2);

        console.log('Posts data inserted successfully.');

        // Close the connection
        client.close();

        console.log("Connection closed");
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

// Run the insertData function
insertData();
