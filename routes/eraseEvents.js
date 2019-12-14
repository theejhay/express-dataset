var express = require('express');
var router = express.Router();

// include controller
const EventController = require('../controllers/events');

// Route related to delete events

// delete all events
router.delete('', EventController.eraseEvents);
module.exports = router;