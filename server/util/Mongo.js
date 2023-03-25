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
