// Going to be defining functions that will create our models in separate files, exporting those functions, executing them in our index.js, and then exporting all of our models wrapped in an object.

// Import sequelize module
var Sequelize = require('sequelize');

// Connect to our database
var sequelize = new Sequelize('basketballapp', 'kristen', 'abc123', {
  host: "localhost",
  // create a new sequelize connection to our new postgres database
  port: 5432,
  dialect: 'postgres'
});

// Import mongoose module
var mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/basketballapp');


// Now that we have our function ready to be exported (in user.js), we're going to export it into our index.js. We're creating a models object and are storing all our models in this models object.
// We are setting models.User key equal to the user we created.
// sequelize.import runs the 'module.exports = function(sequelize, Datatypes){' function and passes in sequelize and Datatypes.
// If we weren't to create all our models in the same file, they'd have to have separate database connections.
var models = {};
// This function also lets SQL know about the schema.

// Creating our models, set them as values to keys of the same name in our models object
// .import() handles dependency injection for us
models.User = sequelize.import('./user');
models.Ownership = sequelize.import('./ownership');
models.Team = require('./team')(mongoose, models);

// Our users and our ownerships aren't associated yet.
// Object.keys gets all the keys of an object
// models.key - those are the names of our models. A couple of them have the method "associate" If it has that method, it runs that method.
// iterating through our models, if any of them have a method called associate, we run it.
Object.keys(models).forEach(function(modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

sequelize.sync();
// sequelize.sync() is kind of like a rake db:migrate. Makes sure our database is in sync with our model, then we export the models.
// Takes all the schemas in sequelize and applies them to our database. Normally, this will be run in our Procfile. On start, there will be a certain script that runs that creates all our database connections (Node doesn't give this to us for free - this will be something we talk about in Express). It will know about the user and will know to create columns in our table. With our database in sync with our model, and our model in our scope, we export it, and it's ready to be used in our app.


// Mongoose doesn't give us any importing for free. We're going to invoke the function and pass it our mongoose sdfdfgdfg
// We will use the same dependency injection tactic to create our Team model in our index.js. mongoose doesn't come with a .import method though, so we will have to roll our own.

// Export our models so we can use them elsewhere
module.exports = models;

