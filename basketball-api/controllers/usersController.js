// importing our models

// defining our first controller action
// similar to rails, but we need to save reference to 'this' and we need to catch our own errors.

'use strict';

// we import our mongoose model here
var models = require('../models/index');

//we import our application controller here
// we do this so we can take the arguments and assignments in our ApplicationController constructor.
var ApplicationController = require('./applicationController');

// calling the ApplicationController constructor in the context of the usersController.
// gets us ApplicationController data
var UsersController = function(response, uri){
  // "arguments" is an array of all the arguments you pass it. .apply takes an array of arguments as the second parameter, whereas .call takes a sequential number of arguments as the second parameter.
  ApplicationController.apply(this, arguments);
};

// this is where UsersController gets .render, .head, etc.
// taking all of the prototype methods of ApplicationController
UsersController.prototype = new ApplicationController();

// creating our own methods on UsersController

UsersController.prototype.index = function(){
  // setting a reference to this in the original context of the controller action. when we're in callbacks, the context of "this" will change. we still want a reference to our usersController so we can use the prototype methods.
  var self = this;
  // find all users. pass it an empty object because it needs one. then we are using a sequelize model. we are expecting users.
  models.User.findAll({}).then(function(users){
    // we want self to be the userscontroller.
    self.render(users);
  }).catch(function(err){
    self.renderError(err);
  });
}

UsersController.prototype.setUser = function(callback) {
  var self = this;
  models.User.findById(self.params['userId']).then(function(user){
    callback(user);
  });
};

// all of the UsersController instances will have access to the same method. If we just did usersController.show, if we created a bunch of usersControllers, there would be a bunch of .show()s.
UsersController.prototype.show = function(){
  var self = this;
  this.setUser(function(user){
    self.render(user);
  });
};

UsersController.prototype.destroy = function(){
  var self = this;
  // takes the userID from our params object, finds the user, and runs the callback with the user as the argument
  self.setUser(function(user){
    // define an anyonymous function expecting user to be passed in. inside, we destroy the user and send head, if not, send error. (with show, we don't need an error because we're not doing any queries.)
    // .destroy() is an instance method on a sequelize query - it's something that sequelize gives us when we create a model. similar to in rails, where you run activerecord methods on instances (user = user.paramsid, then run some method). It deletes the object that runs it.
    user.destroy().then(function(){
      self.head();
    }).catch(function(err){
      self.renderError(err);
    });
  });
};

// save a reference to userscontroller prototype, gather a request
UsersController.prototype.create = function(request) {
  var self = this;
  // gatherRequest() takes a request, handles all the data chunking for us. When all the data has been chunked, we run a callback and pass in our data.
  // we know we're going to receive userData, which is our chunked data. We are going to use that data to create our user in the callback. Once the user is created, we render it if it was successful or an error if not.
  self.gatherRequest(request, function(userData){
    // .create() is also a sequelize class method
    models.User.create(userData).then(function(user){
      self.render(user);
    }).catch(function(err){
      self.renderError(err);
    });
  });
};

module.exports = UsersController;
