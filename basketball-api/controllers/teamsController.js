'use strict';

var models = require('../models/index');

var ApplicationController = require('./applicationController');

var TeamsController = function(response, uri){
  ApplicationController.apply(this, arguments);
};

TeamsController.prototype = new ApplicationController();

TeamsController.prototype.index = function(){
  var self = this;
  models.Team.find({}, function(err, teams){
    if (err) {
      self.renderError(err);
    } else {
      self.render(teams);
    }
  });
};

// TeamsController.prototype.setTeam = function(callback) {
//   var self = this;
//   models.Team.find({name: self.params['teamName']}, function(team){
//     callback(team);
//   });
// };

TeamsController.prototype.setTeam = function(action){
  models.Team.findOne({name: {$regex : new RegExp(this.params['teamName'], "i")} }, function(error, team) {
    if (error) {
      self.renderError(error);
    } else {
      action(team);
    }
  });
}

TeamsController.prototype.show = function(){
  var self = this;
  this.setTeam(function(team){
    console.log(team);
    self.render(team);
  });
};

TeamsController.prototype.destroy = function(){
  var self = this;
  self.setTeam(function(team){
    team.destroy(), function(err){
      if (err) {
        self.renderError(err);
      } else {
        self.head();
      }
    };
  });
};

TeamsController.prototype.create = function(request) {
  var self = this;
  self.gatherRequest(request, function(teamData){
    models.Team.create(teamData, function(err, team){
      console.log(team);
      if (err) {
        self.renderError(err);
      } else {
        self.render(team);
      }
    });
  });
};

module.exports = TeamsController;
