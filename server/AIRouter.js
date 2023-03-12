const express = require('express');
const router = express.Router();
const econtroller = require('./controllers/EssayController')

router.get('/', (req, res) => {
  res.send('Hello, Leroy!');
});

router.post('/', econtroller.writeEssay)

module.exports = router;