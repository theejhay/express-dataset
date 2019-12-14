// include all models
const Actor = require('../middlewares/models').Actor;
const Event = require('../middlewares/models').Event;
const Repo = require('../middlewares/models').Repo;

var getAllEvents = (req, res) => {
	try{

		// get all data
		Event.findAll({
			include: [
				{
					model: Actor
				},
				{
					model: Repo
				}
			],
		}).then(events=>{

			var data = [];

			for (var i = 0; i < events.length; i++) {
				// limited data
				var limitedData =  {
		        "id": events[i].dataValues.id,
		        "type": events[i].dataValues.type,
		        "actor": {
		            "id": events[i].dataValues.Actor.id,
		            "login": events[i].dataValues.Actor.login,
		            "avatar_url": events[i].dataValues.Actor.avatar_url
		        },
		        "repo": {
		            "id": events[i].dataValues.Repo.id,
		            "name": events[i].dataValues.Repo.name,
		            "url": events[i].dataValues.Repo.url
		        },
		        "created_at": events[i].dataValues.createdAt,
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

var addEvent = (req, res) => {
	try{
		// collect data
		var event_id = req.body.id;
		var type = req.body.type;
		var actor = req.body.actor;
		var repo = req.body.repo;
		var created_at = req.body.created_at;

		// validate if event already exist
		Event.findAll({
			where:{
				id:event_id
			}
		}).then(validateEvent=>{
			if(validateEvent.length > 0){
				return res.sendStatus(400);
			}else{

				// validate if actor exist before 
				Actor.findAll({
					where:{
						id: actor.id
					}
				}).then(validateActor=>{


					if(validateActor.length > 0){

						// validate repo
						Repo.findAll({
							where:{
								id:repo.id
							}
						}).then(validateRepo=>{

							if(validateRepo.length > 0){

								// save event
								var SaveEvent = {
									id:event_id,
									type:type,
									actor_id:actor.id,
									repo_id:repo.id,
									createdAt:created_at
								};

								Event.create(SaveEvent).then(created=>{
									if(created){
										return res.sendStatus(201);
									}
								}).catch(err=>{
									return res.sendStatus(400);
								})
							}else{
								// create repo data
								Repo.create(repo).then(savedRepo=>{
									// save event
									var SaveEvent = {
										id:event_id,
										type:type,
										actor_id:actor.id,
										repo_id:savedRepo.id,
										createdAt:created_at
									};

									Event.create(SaveEvent).then(created=>{
										if(created){
											return res.sendStatus(201);
										}
									}).catch(err=>{
										return res.sendStatus(400);
									});
								}).catch(err=>{
									return res.sendStatus(400);
								})
							}
						}).catch(err=>{
							return res.sendStatus(400);
						})
						
					}else{

						// save actor data
						Actor.create(actor).then(savedActor=>{

							// validate repo
							Repo.findAll({
								where:{
									id:repo.id
								}
							}).then(validateRepo=>{

								if(validateRepo.length > 0){

									// save event
									var SaveEvent = {
										id:event_id,
										type:type,
										actor_id:savedActor.id,
										repo_id:repo.id,
										createdAt:created_at
									};

									Event.create(SaveEvent).then(created=>{
										if(created){
											return res.sendStatus(201);
										}
									}).catch(err=>{
										return res.sendStatus(400);
									})
								}else{
									// create repo data
									Repo.create(repo).then(savedRepo=>{
										// save event
										var SaveEvent = {
											id:event_id,
											type:type,
											actor_id:savedActor.id,
											repo_id:savedRepo.id,
											createdAt:created_at
										};

										Event.create(SaveEvent).then(created=>{
											if(created){
												return res.sendStatus(201);
											}
										}).catch(err=>{
											return res.sendStatus(400);
										});
									}).catch(err=>{
										return res.sendStatus(400);
									})
								}
							}).catch(err=>{
								return res.sendStatus(400);
							})
						}).catch(err=>{
							return res.sendStatus(400);
						})
					}
				}).catch(err=>{
					return res.sendStatus(400);
				});
			}
		})
	}catch(e){
		return res.sendStatus(400);
	}
};


var getByActor = (req, res) => {
	try{

		// get actor _id
		var actor_id = req.params.actorID;

		// get all data
		Event.findAll({
			include: [
				{
					model: Actor
				},
				{
					model: Repo
				}
			],
			where:{
				actor_id:actor_id
			},
			order:[
				['id', 'ASC']
			]
		}).then(events=>{

			var data = [];

			for (var i = 0; i < events.length; i++) {
				// limited data
				var limitedData =  {
		        "id": events[i].dataValues.id,
		        "type": events[i].dataValues.type,
		        "actor": {
		            "id": events[i].dataValues.Actor.id,
		            "login": events[i].dataValues.Actor.login,
		            "avatar_url": events[i].dataValues.Actor.avatar_url
		        },
		        "repo": {
		            "id": events[i].dataValues.Repo.id,
		            "name": events[i].dataValues.Repo.name,
		            "url": events[i].dataValues.Repo.url
		        },
		        "created_at": events[i].dataValues.createdAt,
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


var eraseEvents = (req, res) => {
	try{
		// erase all data
		Event.destroy({
			where: {},
			truncate: true
		}).then(deleted=>{
			if(deleted == 0){
				return res.sendStatus(200);
			}
		}).catch(err=>{
			return res.sendStatus(400);
		});
	}catch(e){
		return res.sendStatus(400);
	}
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















