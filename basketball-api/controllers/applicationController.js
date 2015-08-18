'use strict';

// ApplicationController is a prototype.

var ApplicationController = function(response, uri){
  // "this" is our new UsersController.
  if (response) { this.response = this.grantHTTPAccess(response); }
  if (uri) { this.params = this.parseURI(uri); }
};

//responds to http request with given resource
// Method called render - you pass it your data and options.
// This is like in rails where we say render user, and user shows up as json.
ApplicationController.prototype.render = function(data, options){
  var status = 200;

// by default, status is 200, but if we pass in options with a status of anything other than 200, that's what the status will be.
  if (options) {
    var status = options.status || 200;
  }

  this.response.writeHead(status);
  this.response.end(JSON.stringify(data));
}

//parses the request uri into params
// Ultimately creating a params hash that you can pull all of your ids out of
// Will do params.userID
ApplicationController.prototype.parseURI = function(uri){
  var parsedURI = uri.pathname.split("/");
  var params = {};
  for ( var i = 0; i < parsedURI.length; i++ ) {
    if (parsedURI[i] === 'users') {
      parsedURI[i + 1] ? params.userId = parsedURI[i + 1] : undefined;
    }
    if (parsedURI[i] === 'teams') {
      parsedURI[i + 1] ? params.teamName = parsedURI[i + 1] : undefined;
    }
    if (parsedURI[i] === 'players') {
      parsedURI[i + 1] ? params.jerseyNumber = parsedURI[i + 1] : undefined;
    }
  }
  if (uri.query) {
    for (var key in uri.query) {
      params[key] = uri.query[key];
    }
  }
  return params;
}

// chunks the incoming request data and runs a controller action when finished
// When you receive a body in a request, you have to set the encoding, you chunk it in a string, then you do something with the string.
// Takes a request object and a callback (the next thing to do).
ApplicationController.prototype.gatherRequest = function(request, controllerAction){
  var postDataString = "";
  request.setEncoding('utf8');

  request.on('data', function(dataChunk){
    postDataString += dataChunk;
  });

  request.on('end', function(){
    var parsedData = JSON.parse(postDataString)
    controllerAction(parsedData);
  });
}
// adds CORS headers to our response object
ApplicationController.prototype.grantHTTPAccess = function(response){
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');
  return response;
}

// replies to http request with a head and no body
// Head method just responds with a 204 and an empty body. This is what we were using in our destroy actions.
ApplicationController.prototype.head = function(options) {
  var status = 204;

  if (options) {
    var status = options.status;
  }

  this.response.writeHead(status);
  this.response.end();
}

//gives appropriate pre-flight response for options http verb requests
// post, patch, put, destroy are 2-part http requests - pre-flight options request and then the actual request.
ApplicationController.prototype.handleOptions = function(){
  this.response.writeHead(200, {'Content-Type' : 'text/plain'});
  this.response.end("Pre-flight");
}

//responds to http request with an error code
ApplicationController.prototype.renderError = function(error, options){
  var status = 400;

  if (options) {
    var status = options.status;
  }

  this.response.writeHead(400);
  this.response.end(JSON.stringify({"error": "You done goofed!"}));
}
//responds to http request with an error code
ApplicationController.prototype.render404 = function(){
  this.response.writeHead(404);
  this.response.end(JSON.stringify({"error": "You done goofed!"}));
}

// going to be giving these methods to new instances of applicationcontroller

// export applicationcontroller
module.exports = ApplicationController;
