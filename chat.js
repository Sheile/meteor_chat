Comments = new Meteor.Collection("comments");

if (Meteor.is_client) {
  Template.input.greeting = function () {
    return "Welcome to chat.";
  };

  Template.input.events = {
    'click input#submit, keyup input#text' : function (evt) {

      //  Returnキー以外は何もしない
      if(evt.type == "keyup" && evt.which != 13) return;

      var name = $("input#name").val();
      var text = $("input#text").val();

      if(name == "" || text == "") return;

      Comments.insert({ name: name, text: text, date: new Date().toString() });
      $("input#text").val("");
      $("input#text").focus();
    }
  };

  Template.comments.comments = function() {
    return Comments.find({}, {sort: {date: -1}});
  }

  Template.comment.date = function() {
    return new Date(this.date).format("yyyy/mm/dd HH:MM:ss")
  }
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
    //  Comments.insert({text: "sample text", date: new Date() });
  });
}
