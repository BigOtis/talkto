const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const MAX_CACHE_SIZE = 1000;

let avatarsCache = [];
let avatarsIndex = new Map();

// save a given avatar to the database
exports.saveAvatarToDB = async (name, img_url, creatorIP) => {
  try {
    const cleanName = name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '').toLowerCase();

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');
    const collection = db.collection('avatars');

    const doc = {
      name: cleanName,
      img_url: img_url,
      creatorIP: creatorIP,
    };

    await collection.insertOne(doc);

    addToCache(doc);

    client.close();
  } catch (err) {
    console.log(err);
  }
}

// get a given avatar from the database
exports.getAvatarFromDB = async (name) => {
  try {
    const cleanName = name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '').toLowerCase();

    const cachedAvatar = getFromCache(cleanName);

    if (cachedAvatar) {
      return cachedAvatar;
    }

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');
    const collection = db.collection('avatars');

    const result = await collection.findOne({ name: cleanName });

    client.close();

    if (result) {
      addToCache(result);
    }

    return result ? result.img_url : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// a local cache to store the most recently used avatars
function addToCache(avatar) {
  if (avatarsCache.length >= MAX_CACHE_SIZE) {
    const removedAvatar = avatarsCache.shift();
    avatarsIndex.delete(removedAvatar.name);
  }

  avatarsCache.push(avatar);
  avatarsIndex.set(avatar.name, avatar);
}

function getFromCache(name) {
  const avatar = avatarsIndex.get(name);
  return avatar ? avatar.img_url : null;
}

exports.saveStatsToDB = async (name, creatorIP, email) => {
  try {
    // Clean the name text by removing any special characters, numbers, and spaces
    const cleanName = name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "").toLowerCase();

    // Connect to the MongoDB database
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("talktoai");

    // Create the stats collection if it doesn't exist
    const collection = db.collection("stats");
    await collection.createIndex({ name: 1 }, { unique: true });

    // Update the document for the given name with the number of messages sent and the lastUpdate date
    const nameDoc = await collection.findOneAndUpdate(
      { name: cleanName },
      { $inc: { messages: 1 }, $set: { lastUpdate: new Date() } },
      { upsert: true, returnOriginal: false }
    );

    // Create the IP collection if it doesn't exist
    const ipCollection = db.collection("ip_stats");
    await ipCollection.createIndex({ creatorIP: 1 }, { unique: true });

    // Update the document for the given IP with the number of messages sent and the lastUpdate date
    const ipDoc = await ipCollection.findOneAndUpdate(
      { creatorIP: creatorIP },
      { $inc: { messages: 1 }, $set: { lastUpdate: new Date() } },
      { upsert: true, returnOriginal: false }
    );

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    // Create the all_stats collection if it doesn't exist
    const allStatsCollection = db.collection("all_stats");
    await allStatsCollection.createIndex({ month: 1, year: 1 }, { unique: true });

    // Update the document for the current month with the total number of messages
    const allStatsDoc = await allStatsCollection.findOneAndUpdate(
      { month: currentMonth, year: currentYear },
      { $inc: { messages: 1 }, $set: { lastUpdate: new Date() } },
      { upsert: true, returnOriginal: false }
    );

    // Close the connection to the database
    client.close();
  } catch (err) {
    console.log(err);
  }
};
  
// Save an email to the database
exports.saveEmailToDB = async (email) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');

    const collection = db.collection('emails');
    await collection.createIndex({ email: 1 }, { unique: true });

    await collection.insertOne({ email });

    client.close();
  } catch (err) {
    console.log(err);
  }
};

// Remove an email from the database
exports.removeEmailFromDB = async (email) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');

    const collection = db.collection('emails');
    const deleteResult = await collection.deleteOne({ email });

    client.close();

    // returns true if an email was removed, otherwise false
    return deleteResult.deletedCount > 0;
  } catch (err) {
    console.log(err);
  }
};

// Check if an email exists in the database
exports.checkIfEmailExists = async (email) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');

    const collection = db.collection('emails');
    const emailDocument = await collection.findOne({ email });

    client.close();

    // returns true if an email was found, otherwise false
    return emailDocument != null;
  } catch (err) {
    console.log(err);
    return false;
  }
};