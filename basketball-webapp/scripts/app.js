var App = (function(){

  var apiURL = "http://localhost:8888";

  var _renderUsers = function(users) {
    var userTemplater = Handlebars.compile($('#users-template').html());
    var html = userTemplater({users: users});
    $('#content').html(html);
  };

  var _renderNewUser = function(user){
    var userTemplater = Handlebars.compile($('#new-user-template').html());
    var html = userTemplater({user: user});
    $('#users-list').append(html);
  };

  var _renderUser = function(user) {
    var userTemplater = Handlebars.compile($('#user-show-template').html());
    var html = userTemplater({user: user});
    $('#content').html(html);
  };

////////// TEAMS //////////

  var _renderTeams = function(teams) {
    var teamTemplater = Handlebars.compile($('#teams-template').html());
    var html = teamTemplater({teams: teams});
    $('#content').html(html);
  };

  var _renderNewTeam = function(team){
    var teamTemplater = Handlebars.compile($('#new-team-template').html());
    var html = teamTemplater({team: team});
    $('#teams-list').append(html);
  };

  var _renderTeam = function(team) {
    var teamTemplater = Handlebars.compile($('#team-show-template').html());
    var html = teamTemplater({team: team});
    $('#content').html(html);
  };

//////////

  var init = function(){
    //we apply users click handler
    $('#users-index').on('click', function() {
      $.ajax({
        url: apiURL + '/users',
        method: "GET"
      }).then(function(response){
        _renderUsers(JSON.parse(response));
      });
    });

    // "Bubbling"
    $('#content').on('click', '#new-user', function(e){
      e.preventDefault();
      var user = {
        firstName: $('#first-name').val(),
        lastName: $('#last-name').val(),
        email: $('#email').val(),
      };

      $.ajax({
        url: apiURL + '/users',
        method: "POST",
        data: JSON.stringify(user)
      }).then(function(user){
        _renderNewUser(JSON.parse(user));
      })
    });

    $('#content').on('click', '.user-show', function(){
      $.ajax({
        // jQuery 'this' points to the thing that executes the event. so 'user-show' is this.
        // .closest looks up the DOM tree
        // Finding the user that it's wrapped in (each user is wrapped in a div that has a class 'user' and a data id with its ID - extract its ID
        url: apiURL + '/users/' + $(this).closest('.user').data('id'),
        method: "GET"
      }).then(function(user){
        console.log(user)
        _renderUser(JSON.parse(user));
      });
    });

    $('#content').on('click', '.delete-user', function(){
      var $userProfile = $('#user-profile');
      $.ajax({
        url: apiURL + '/users/' + $userProfile.data('id'),
        method: "DELETE"
      }).then(function(response){
        $userProfile.remove();
      });
    });

////////// TEAMS //////////

    $('#teams-index').on('click', function() {
      $.ajax({
        url: apiURL + '/teams',
        method: "GET"
      }).then(function(team){
        _renderTeams(JSON.parse(team));
      });
    });

    $('#content').on('click', '#new-team', function(e){
      e.preventDefault();
      var team = {
        name: $('#team-name').val(),
        city: $('#city').val()
      };
      $.ajax({
        url: apiURL + '/teams',
        method: "POST",
        data: JSON.stringify(team)
      }).then(function(team){
        _renderNewTeam(JSON.parse(team));
      });
    });

    $('#content').on('click', '.team-show', function(){
      $.ajax({
        url: apiURL + '/teams/' + $(this).closest('.team').data('name'),
        method: "GET"
      }).then(function(team){
        _renderTeam(JSON.parse(team));
      });
    });

    $('#content').on('click', '.delete-team', function(){
      var $teamProfile = $('#team-profile');
      $.ajax({
        url: apiURL + '/teams/' + $teamProfile.data('name'),
        method: "DELETE"
      }).then(function(response){
        $teamProfile.remove();
      });
    });
  }


  return {
    init: init
  };

})();

$(document).ready(function(){
  App.init();
});
