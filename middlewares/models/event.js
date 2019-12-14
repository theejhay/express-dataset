'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    type: DataTypes.STRING,
    actor_id: DataTypes.BIGINT,
    repo_id: DataTypes.BIGINT
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.Actor, {
    	foreignKey: 'actor_id',
    	onDelete: 'CASCADE'
    });

    Event.belongsTo(models.Repo, {
    	foreignKey: 'repo_id',
    	onDelete: 'CASCADE'
    });
  };
  return Event;
};