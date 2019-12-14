var express = require('express');
var router = express.Router();

// include controller
const ActorController = require('../controllers/actors');

// Routes related to actor.

// get all actors
router.get('', ActorController.getAllActors);

// update actors profile
router.put('', ActorController.updateActor);

// get all actors streak
router.get('/streak', ActorController.getStreak);

module.exports = router;