App.room = App.cable.subscriptions.create("RoomChannel", {
  connected: function() {
    console.log("connected")
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    // $("tbody").append("<%= render partial: "room/message", locals: {message: message} %>");
    $("ol").append(data);
    // Called when there's incoming data on the websocket for this channel
  },

  speak: function(content) {
    return this.perform('speak', {message: content});
  }
});

$(function(){
  $(".button").on("click",function(){
    var content = $(".chat-input").val();
    App.room.speak(content);
    $(".chat-input").val("")
  });
});