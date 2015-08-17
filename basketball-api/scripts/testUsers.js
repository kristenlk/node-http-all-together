// Put require('../models/index') wherever we need access to our models.
// Requiring the relative path to our index.
// require creates a singleton, so it won't duplicate and take up more memory if we include it in multiple places.

// Main difference between mongoose and sequelize: When we're actually doing queries is that in mongoose, it allows us to pass in a callback - params and then an anonymous function to execute when it's done. Sequelize doesn't give us that - so we need to handle the asynchronosity of sequelize like we do with AJAX.
// .create() returns a promise.
var models = require('../models/index');

models.User.create({
  firstName: 'Bob',
  lastName: 'Feller',
  email: 'bob@bob.com'
}).then(function(user){
  console.log('User ' + user.firstName + ' has been created. Whoopee!');
}, function(err){
  console.log(err);
});

models.User.create({
  firstName: 'Max',
  lastName: 'Blaushild',
  email: 'hello@hello.com'
}).then(function(user){
  console.log('User ' + user.firstName + ' has been created. Whoopee!');
}).catch(function(err){
  console.log(err);
});
