// Creating the join between our our PostgreSQL User model and our MongoDB Team model
// They use different ORMs

 module.exports = function(sequelize, Datatypes){
   var Ownership = sequelize.define('Ownership', {
     id: {
       type: Datatypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
     },
     // teamID is where we're going to store the mongo ID of our team.
     // Going to turn our mongo IDs of our teams into strings, and set them as the teamID column.
     teamId: {
       type: Datatypes.STRING,
       allowNull: false
     }
   }, {
    // This is what we're going to use to create our association with our team.
    // This class method is going on Ownership.
     classMethods: {
       associate: function(models){
        // This is our equivalent of the Rails dependent destroy - when the user is deleted, all of its ownerships are deleted too. We don't want ownerships without users.
        // Ownership belongs to models.User
        // This is a join between Users and Teams.
         Ownership.belongsTo(models.User, {
           onDelete: "CASCADE",
           foreignKey: {
             allowNull: false
           }
         });
       }
   }
 });
   // Export our model so it can be used in index.js
   return Ownership;
 };
