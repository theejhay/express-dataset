var express = require('express');
var router = express.Router();

// include controller
const EventController = require('../controllers/events');

// Routes related to event

// get all events
router.get('', EventController.getAllEvents);

// add new event
router.post('', EventController.addEvent);

// filter events by actors
router.get('/actors/:actorID', EventController.getByActor);

module.exports = router;