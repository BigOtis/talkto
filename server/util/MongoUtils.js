const { MongoClient } = require('mongodb');
const { auth } = require('./Auth');

// get the MongoDB connection string from the .env file
const url = process.env.MONGO_URL;
const client = new MongoClient(url);

// save the text to the GCloud storage bucket as a JSON file
exports.saveTextToDB = async (title, prompt, output, ipaddr) => {

    const timestamp = Date.now();
    const doc = {title, prompt, output, timestamp, ipaddr};
    const client = new MongoClient(url);

    // connect to the MongoDB database
    await client.connect();
    const db = client.db('otis-fuse');
    const collection = db.collection('essays');

    // insert the text into the database
    const result = await collection.insertOne(doc);
    console.log(result);

    // close the connection to the database
    await client.close();
}

// get how many times a given ip has generated an essay in the last 24 hours
exports.getIPCount = async (ipaddr) => {
    const client = new MongoClient(url);

    // connect to the MongoDB database
    await client.connect();
    const db = client.db('otis-fuse');
    const collection = db.collection('essays');

    // get the number of documents with the given ip address
    const result = await collection.countDocuments({ipaddr: ipaddr, timestamp: {$gt: Date.now() - 86400000}});
    console.log(result);

    // close the connection to the database
    await client.close();

    return result;
}

// check if the user exists in our users collection
// if they do not exist, create a new user and initialize with their email
// returns the new/existing user or undefined if the token is invalid
exports.checkUser = async (token) => {

    const email = await auth(token);
    if(email){
        const client = new MongoClient(url);
        const db = client.db('otis-fuse');
        const collection = db.collection('users');

        // check if the user exists in the database
        const user = collection.findOne({email: email});
        if(user){
            return user;
        }
        else{
            // create a new user
            const newUser = {email: email, essayCredits: 5};
            result = await collection.insertOne(newUser);
            if(result){
                return newUser;
            }
        }
    }
    return undefined;
}

// update the user in the database
exports.updateUser = async (user) => {
    const client = new MongoClient(url);
    const db = client.db('otis-fuse');
    const collection = db.collection('users');
    const result = collection.updateOne({email: user.email}, {$set: {essayCredits: user.essayCredits}});
    return result;
}


