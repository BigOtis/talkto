const express = require('express');
const path = require("path");
const router = require('./server/AIRouter');
const bodyParser = require('body-parser');

// Creating express server
const app = express();

const PORT = process.env.PORT || 4000;

// Middleware to validate request
const validateRequest = (req, res, next) => {
  // Allow public access to GET /api/stats
  if (req.method === 'GET' && req.path === '/stats') {
    return next();
  }

  const expectedOrigins = ['chat.otisfuse.com', 'www.otisfuse.com', 'localhost:3000'];
  const userAgent = req.get('User-Agent');
  const referer = req.get('Referer');
  const origin = req.get('Origin');

  if (
    userAgent &&
    referer &&
    origin &&
    expectedOrigins.some((expectedOrigin) =>
      origin.toLowerCase().includes(expectedOrigin.toLowerCase())
    )
  ) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid request' });
  }
};
  
// router for the api layer
app.use(bodyParser.json());
app.use('/api', validateRequest, router);

// router for the static files
app.use(express.static(path.join(__dirname, "build"), { maxAge: "10s"}));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "build", "index.html")));

// serve sitemap.xml
app.get("/sitemap.xml", (req, res) => res.sendFile(path.join(__dirname, "build", "sitemap.xml")));

// serve robots.txt
app.get("/robots.txt", (req, res) => res.sendFile(path.join(__dirname, "build", "robots.txt")));

// serve ads.txt
app.get("/ads.txt", (req, res) => res.sendFile(path.join(__dirname, "build", "ads.txt")));

// catch all router for everything else
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "build", "index.html")));

app.listen(PORT, () => {
    console.log(`Starting Express server at ${PORT}`);
});
