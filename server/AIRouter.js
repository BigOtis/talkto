const express = require('express');
const router = express.Router();
const scontroller = require('./controllers/SearchController');
const ccontroller = require('./controllers/ChatController');

router.get('/', (req, res) => {
  res.send('Hello, Leroy!');
});

router.post('/getImage', scontroller.searchForImageUrl);
router.post('/getChat', ccontroller.getChatMessage);
router.post('/getGreeting', ccontroller.generateGreeting);
router.post('/getHelper', ccontroller.getHelperMessage);

module.exports = router;