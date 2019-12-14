'use strict';
module.exports = (sequelize, DataTypes) => {
  const Repo = sequelize.define('Repo', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  Repo.associate = function(models) {
    // associations can be defined here
    Repo.hasMany(models.Event, {
    	foreignKey: 'repo_id',
    	onDelete: 'CASCADE'
    });
  };
  return Repo;
};