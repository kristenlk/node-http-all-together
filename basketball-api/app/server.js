'use strict';

// we import our node modules here
var http = require('http'),
    url = require('url'),
    port = 8888;

// we import our controllers here
var ApplicationController = require('../controllers/applicationController');
var UsersController = require('../controllers/usersController');
var TeamsController = require('../controllers/teamsController');
// we don't need to import our models here because we already did that in our controller

// we create our http server instance
var server = http.createServer(function(request, response){
  // we parse the url ....
  var uri = url.parse(request.url, true);
  // and pass it through our router
  // need to explicitly check the path name you get against a number of different scenarios

// this is a really brute force way of doing it - express handles all of this for us - handles all of the parsing, etc.
// whenever the uri.pathname matches one of these cases, it executes the block.
  switch (uri.pathname) {
    // if it's users, we know we need a userscontroller
  case "/users":
    var usersController = new UsersController(response, uri);
    switch (request.method) {
      case "GET":
        usersController.index();
        break;
      case "POST":
        usersController.create(request);
        break;
      default:
        usersController.render404();
        break;
    }
    break;
    // checking to see if it's a url that is /users/any number of digits
  case uri.pathname.match(/(\/users\/)\d+/) ? uri.pathname.match(/(\/users\/)\d+/)[0] : null:
    var usersController = new UsersController(response, uri);
    switch (request.method) {
      case "GET":
        usersController.show();
        break;
      case "DELETE":
        usersController.destroy();
        break;
      case "OPTIONS":
        usersController.handleOptions();
        break;
      default:
        usersController.render404();
        break;
    }
    break;
  case "/teams":
    var teamsController = new TeamsController(response, uri);
    switch (request.method) {
      case "GET":
        teamsController.index();
        break;
      case "POST":
        teamsController.create(request);
        break;
      default:
        teamsController.render404();
        break;
    }
    break;
  case uri.pathname.match(/(\/teams\/)\w+/) ? uri.pathname.match(/(\/teams\/)\w+/)[0] : null:
    var teamsController = new TeamsController(response, uri);
    switch (request.method) {
      case "GET":
        teamsController.show();
        break;
      case "DELETE":
        teamsController.destroy();
        break;
      case "OPTIONS":
        teamsController.handleOptions();
        break;
      default:
        teamsController.render404();
        break;
    }
    break;
  default:
      var applicationController = new ApplicationController(response, uri);
      applicationController.render404();
      break;
  }


});

// we tell our server to listen in on port 5000
server.listen(port, function(){
  console.log('We are a go!!!!!!');
});
