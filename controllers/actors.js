// include all models
const moment = require('moment');
const _ = require('lodash');
const Actor = require('../middlewares/models').Actor;
const Event = require('../middlewares/models').Event;

const getStreakInfo = (allEvents) => {
  const streakInfo = {};
  allEvents.forEach((event) => {
    const { actor_id, createdAt } = event;
    if (streakInfo[actor_id]) {
      //
      const actorStreak = streakInfo[actor_id];
      const lastEvent = moment(actorStreak.lastEvent, 'YYYY-MM-DD');
      const currentEvent = moment(createdAt, 'YYYY-MM-DD');
      const daysDifference = lastEvent.diff(currentEvent, 'days');
      if (daysDifference === 1) {
        // increment streak
        actorStreak.currentStreak += 1;
        if (actorStreak.currentStreak > actorStreak.highestStreak) {
          actorStreak.highestStreak = actorStreak.currentStreak;
          // actorStreak.hightestStreak += 1; // thoughts?
        } else {
          // do nothing
        }
      } else if (daysDifference > 1) {
        // reset streak
        actorStreak.currentStreak = 0;
      } else {
        // do nothing
      }
      actorStreak.lastEvent = createdAt;
    } else {
      streakInfo[actor_id] = {
        currentStreak: 0,
        highestStreak: 0,
        lastEvent: createdAt,
        latestEvent: moment(createdAt).valueOf(),
        login: event.Actor.login,
      };
    }
  });
  return streakInfo;
};

const getStreakInfoArray = streakInfo => Object.keys(streakInfo).map(actor_id => ({
  actor_id,
  highestStreak: streakInfo[actor_id].highestStreak,
  latestEvent: streakInfo[actor_id].latestEvent,
  login: streakInfo[actor_id].login,
}));

const getActorsIdByStreak = sortedStreakInfo => sortedStreakInfo.map(info => Number(info.actor_id));

// get all actors
var getAllActors = (req, res) => {
	try{

		// fetch actors
		Actor.findAll({})
		.then(actors=>{
			var data = [];

			for (var i = 0; i < actors.length; i++) {
				// limited data
				var limitedData =  {
		            "id": actors[i].dataValues.id,
		            "login": actors[i].dataValues.login,
		            "avatar_url": actors[i].dataValues.avatar_url
		        }
				data.push(limitedData);
			}

			return res.status(200).json(data);
		}).catch(err=>{
			return res.sendStatus(400);
		});
	}catch(e){
		return res.sendStatus(400);
	}	
};

// update actors record
var updateActor = (req, res) => {
	try{
		// collect data
		var actor_id = req.body.id;
		var login = req.body.login;
		var avatar_url = req.body.avatar_url;

		// validate if actor exist
		Actor.findAll({
			where:{
				id:actor_id
			}
		}).then(validateActor=>{
			if (validateActor.length < 1) {
				return res.sendStatus(404);
			}else{
				Actor.update({
					login:login,
					avatar_url:avatar_url
				},{
					where:{
						id:actor_id
					}
				}).then(updated=>{
					if(updated[0] == 1){
						return res.sendStatus(200);
					}else{
						return res.sendStatus(400);
					}
				}).catch(err=>{
					return res.sendStatus(400);
				});
			}
		}).catch(err=>{
			return res.sendStatus(400);
		})
	}catch(e){
		return res.sendStatus(500);
	}
};

// get all actor streak
const getStreak = async (req, res) => {
		const allEvents = await Event.findAll({
		include: [Actor],
		order: [
		  ['actor_id'],
		  ['createdAt', 'DESC'],
		],
		});

		const streakInfo = getStreakInfo(allEvents);
		const streakInfoArray = getStreakInfoArray(streakInfo);
		const sortedStreakInfo = _.orderBy(
		streakInfoArray,
		['highestStreak', 'latestEvent', 'login'],
		['desc', 'desc', 'asc'],
		);
		const actorsIdByStreak = getActorsIdByStreak(sortedStreakInfo);
		const actorsInOrder = await Promise.all(actorsIdByStreak.map(actor_id => Actor.findOne({
		where: {
		  id: actor_id,
		},
		attributes: {
		  include: ['id', 'login', 'avatar_url'],
		  exclude: ['createdAt', 'updatedAt'],
		},
		})));
		return res.status(200).send(actorsInOrder);
};


module.exports = {
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















