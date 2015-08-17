'use strict';

// Defining two schemas: a player schema and a team schema

module.exports = function(mongoose){

  var Schema = mongoose.Schema;

  var playerSchema = new Schema({

    name: {
      type: String,
      required: true
    },

    // setting up a dependency. This is the mongoDB ID a document gets. We are saying that it refers to the Team model.
    team: { type: Schema.Types.ObjectId, ref: 'Team' },

    jerseyNumber: {
      type: Number,
      required: true
    },

    position: {
      type: String,
      enum: { values: 'PG SG SF PF C'.split(' '),
              message: 'enum failed at path {PATH} with value {VALUE}'
            }
    }
  });

  var teamSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    // Players is an array of player schema. That playerSchema - we’re defining up at the top.
    // Mongoose, instead of being relational, allows you to nest one document inside of another. Going to be nesting our player schema in our team schema. Whenever take a team schema out of our database, it will come with an array of players.
    // We can enforce field restrictions on the thing we’re nesting.
    // Wrap the nested schema in brackets.
    players: [playerSchema]
  });

// dependent destroy substitute

// We do not have that hook between teams and ownerships as of now. We don't want orphan ownerships. So whenever a team goes, so does all of its ownerships.
// To do this, we need access to our ownership file within the file in which we declare our team. We do this by injecting it as a dependency. When we create a team model, we pass it mongoose and our models. With our model in the scope of our file, we can create this hook.
// We have a team schema, the .post creates a hook. Schemas have a pre and post method. The first parameter is what it's waiting for.
// Whenever a team schema is removed, after the team schema is removed, run this callback.
// Because one table is from Postgres and one is from MongoDB, this is kind of messy but we have to do it.
// We need to create a query on ownership inside of the definition of our team model.

// You have your teamSchema, and then AFTER (this is what "post" is referring to - there is also a "pre") the teamSchema is removed,

teamSchema.post('remove', function(team){
  // where the team ID is equal to our mongo object's id (to string).
  models.Ownership.destroy({where : { teamId: team._id.toString()} }).then(function(){
    console.log('We are in SYNC');
  });
});

// Uses mongoose.model to create our model, and then we return it.
// We are exporting a function that returns our model, and we are calling that function in our index.js and injecting the necessary dependencies for the function to create the model. That way, we have all our models in one place.
  var Team =  mongoose.model('Team', teamSchema);

  return Team;
}

// Say we create team 1. If we were to push an object into team1.players and try to save it, and it did not confirm to the playerSchema standards, we'd get an error.
