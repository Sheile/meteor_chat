Comments = new Meteor.Collection("comments");

if (Meteor.is_client) {
  function current_room() {
    return Session.get("current_room") || Template.rooms.rooms[0].name;
  }

  Template.rooms.selected = function() {
    return current_room() == this.name ? "selected" : ""
  }

  Template.rooms.rooms = [{name: "rooma", display: "部屋A"},
                          {name: "roomb", display: "部屋B"}];

  Template.rooms.events = {
    'click a': function(evt) {
      Session.set("current_room", $(evt.target).data("name"));
    }
  };

  Template.input.current_name = function() {
    return Session.get("name");
  };

  Template.input.events = {
    'click input#submit, keyup input#text' : function (evt) {

      //  Returnキー以外は何もしない
      if(evt.type == "keyup" && evt.which != 13) return;

      var name = $("input#name").val();
      var text = $("input#text").val();

      if(name == "" || text == "") return;

      Session.set("name", name);

      Comments.insert({ room: current_room(), name: name, text: text, date: new Date().toString() });
      $("input#text").val("");
      $("input#text").focus();
    }
  };

  Template.comments.comments = function() {
    return Comments.find({room: current_room()}, {sort: {date: -1}});
  }

  Template.comment.date = function() {
    return new Date(this.date).format("yyyy/mm/dd HH:MM:ss")
  }
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
    var latestHour = null;
    Meteor.setInterval(function() {
      var hour = new Date().getHours();
      var min = new Date().getMinutes();
      if(hour != latestHour && min == 0) {
        var text = '---- サーバが' + new Date().format("HH") + '時をお知らせします。 ----'
        Comments.insert({ room: 'rooma', name: '時報', text: text, date: new Date().toString() });

        latestHour = hour;
      }
    }, 1000);
  });
}
