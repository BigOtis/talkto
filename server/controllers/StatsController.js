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

    // Use the name as entered (trimmed, max 100 chars)
    const avatarNames = topAvatars.map(a => a.name.trim().slice(0, 100));
    const avatars = await db.collection('avatars')
      .find({ name: { $in: avatarNames } })
      .toArray();

    console.log('Matching avatars from avatars collection:', avatars);

    // Build map with names as entered
    const avatarMap = {};
    avatars.forEach(a => {
      avatarMap[a.name] = {
        img_url: a.img_url,
        viewableName: a.name
      };
    });
    const topAvatarsWithImages = topAvatars.map(a => {
      const key = a.name.trim().slice(0, 100);
      return {
        name: a.name,
        viewableName: avatarMap[key]?.viewableName || a.name,
        messages: a.messages,
        img_url: avatarMap[key]?.img_url || null
      };
    });

    console.log('Final topAvatarsWithImages:', topAvatarsWithImages);

    // 3. Messages sent this month
    const nowDate = new Date();
    const month = nowDate.getMonth() + 1;
    const year = nowDate.getFullYear();
    const allStatsDoc = await db.collection('all_stats').findOne({ month, year });
    const messagesThisMonth = allStatsDoc ? allStatsDoc.messages : 0;

    // 4. Messages all time
    const allStatsCursor = await db.collection('all_stats').find({}, { projection: { messages: 1 } });
    let messagesAllTime = 0;
    await allStatsCursor.forEach(doc => { messagesAllTime += doc.messages || 0; });

    client.close();

    const stats = {
      totalUsers,
      totalCharacters,
      topAvatars: topAvatarsWithImages,
      messagesThisMonth,
      messagesAllTime
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