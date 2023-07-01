const express = require('express');
const path = require("path");
const router = require('./server/AIRouter');
const bodyParser = require('body-parser');

// Creating express server
const app = express();

const PORT = process.env.PORT || 4000;

// Middleware to validate request
const validateRequest = (req, res, next) => {
    const expectedOrigins = ['chat.otisfuse.com', 'www.otisfuse.com', 'localhost:3000'];
  
    // Check the request headers for common properties that indicate a real user/browser
    const userAgent = req.get('User-Agent');
    const referer = req.get('Referer');
    const origin = req.get('Origin');
  
    // Perform additional checks as needed
    if (
      userAgent &&
      referer &&
      origin &&
      expectedOrigins.some((expectedOrigin) =>
        origin.toLowerCase().includes(expectedOrigin.toLowerCase())
      )
    ) {
      // Request is coming from a real user/browser and an expected origin
      next();
    } else {
      // Request is suspicious or missing required headers
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

// catch all router for everything else
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "build", "index.html")));

app.listen(PORT, () => {
    console.log(`Starting Express server at ${PORT}`);
});
