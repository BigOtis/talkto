const express = require('express');
const router = express.Router();
const scontroller = require('./controllers/SearchController');
const ccontroller = require('./controllers/ChatController');
const ucontroller = require('./controllers/UserController');

router.get('/', (req, res) => {
  res.send('Hello, Leroy!');
});

router.post('/getImage', scontroller.searchForImageUrl);
router.post('/getChat', ccontroller.getChatMessage);
router.post('/getGreeting', ccontroller.generateGreeting);
router.post('/getHelper', ccontroller.getHelperMessage);
router.post('/addEmail', ucontroller.addEmailToDB);
router.post('/removeEmail', ucontroller.removeEmailFromDB);

module.exports = router;