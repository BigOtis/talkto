const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL;

let cachedStats = null;
let lastCacheTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

exports.getStats = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedStats && (now - lastCacheTime < CACHE_DURATION)) {
      return res.json(cachedStats);
    }

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('talktoai');

    // 1. Total users (unique IPs)
    const totalUsers = await db.collection('ip_stats').countDocuments();

    // 1b. Total characters created
    const totalCharacters = await db.collection('avatars').countDocuments();

    // 2. Top 10 avatars by messages
    const topAvatars = await db.collection('stats')
      .find({}, { projection: { name: 1, messages: 1 } })
      .sort({ messages: -1 })
      .limit(10)
      .toArray();

    console.log('Top avatars from stats:', topAvatars);

    const clean = (name) => name?.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '').toLowerCase();
    const avatarNames = topAvatars.map(a => clean(a.name));
    const avatars = await db.collection('avatars')
      .find({ name: { $in: avatarNames } })
      .toArray();

    console.log('Matching avatars from avatars collection:', avatars);

    // Build map with lowercased names
    const avatarMap = {};
    avatars.forEach(a => { avatarMap[a.name] = a.img_url; });
    const topAvatarsWithImages = topAvatars.map(a => {
      const cname = clean(a.name);
      return {
        name: a.name,
        messages: a.messages,
        img_url: avatarMap[cname] || null
      };
    });    

    console.log('Final topAvatarsWithImages:', topAvatarsWithImages);

    // 3. Messages sent this month
    const nowDate = new Date();
    const month = nowDate.getMonth() + 1;
    const year = nowDate.getFullYear();
    const allStatsDoc = await db.collection('all_stats').findOne({ month, year });
    const messagesThisMonth = allStatsDoc ? allStatsDoc.messages : 0;

    client.close();

    const stats = {
      totalUsers,
      totalCharacters,
      topAvatars: topAvatarsWithImages,
      messagesThisMonth
    };
    console.log('Stats response:', stats);
    cachedStats = stats;
    lastCacheTime = now;
    res.json(stats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}; 