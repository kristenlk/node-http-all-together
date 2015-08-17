// This is the equivalent of mongoose.schema for sequelize.
// We are exporting this function. Inside of it, we're using the models we inject to define our schema and return our user.
// Sequelize is shoving 'sequelize' and 'Datatypes' into the function itself.
module.exports = function(sequelize, Datatypes){
  // Instead of mongoose.schema, we use sequelize.define.
  var User = sequelize.define('User', {
    // This is where we're defining the columns. Id is an integer, auto-increments, is the primary key, and must exist.
    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: Datatypes.STRING,
      allowNull: false
    },
    lastName: {
      type: Datatypes.STRING,
      allowNull: false
    },
    email: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
      validates: {
        isEmail: true
      }
    }
  }, {
    // Options you can use while defining your model. You will only be using this third argument when you have a very specific thing you want to do.
    // Adding an uppercase user. It will have User.associate as one of its methods.
    // Not doing anything with this yet because our ownership model does not yet exist.
    classMethods: {
      associate: function(models){
        User.hasMany(models.Ownership)
      }
    }
  });

  return User;
};
