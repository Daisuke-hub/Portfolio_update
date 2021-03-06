App.room = App.cable.subscriptions.create("RoomChannel", {

  notification: function(message){
    var title = 'SESSIONから新規のメッセージがあります';
    var n = new Notification(
      title,
      {
        body: message,
        tag: 'SESSION_message',
      }
    );
  },

  connected: function() {
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    var current_user_id = $("#current_user_id").val();
    var room_id = $("#room_id").val();
    if (current_user_id == data["user_id"]){
      $('<li>',{
        id: "message_id_" + data["message_id"],
        class: "right",
      }).appendTo("#add");
      $('<span>',{
        class: "created_time",
        text: data["created_time"],
      }).appendTo("#message_id_" + data["message_id"]);
      $('<span>',{
        class: "receive_balloon_right",
        text: data["content"],
      }).appendTo("#message_id_" + data["message_id"]);
      
    } else if (current_user_id == data["receive_user_id"] && room_id == data["room_id"]){
      $('<li>',{
        id: "message_id_" + data["message_id"],
        class: "left",
      }).appendTo("#add");
      if (data["user_image"] == null){
        $("#message_id_" + data["message_id"]).append('<img src=/assets/no_image.jpg class=message_image >' );
      }else{
        $("#message_id_" + data["message_id"]).append('<img src="' + data["user_image"] + '"class=message_image >' );
      };
      $('<span>',{
        class: "receive_balloon",
        text: data["content"],
      }).appendTo("#message_id_" + data["message_id"]);
      $('<span>',{
        class: "created_time",
        text: data["created_time"],
      }).appendTo("#message_id_" + data["message_id"]);
    };

    var chat_flag = $("#chat_flag").val();
    if (current_user_id == data["receive_user_id"] && chat_flag == "true"){
      var message = data["content"];
      App.room.notification(message);
    } else if (current_user_id == data["user_id"]) {
      $('input').focus();
      $('#page_top').on('click',function(){
        $('body, html').animate({
        scrollBottom:0
        }, 800);
        return false;
      });
    };
    // Called when there's incoming data on the websocket for this channel
  },

  speak: function(content, room_id, receive_user_id) {
    return this.perform('speak', {message: content, room_id: room_id, receive_user_id: receive_user_id});
  }
});

$(function(){
  $(".button").on("click",function(){
    var content = $(".chat-input").val();
    if(content.length == 0){
      alert("メッセージを入力して下さい");
      $('input').focus();
    }else{
      var room_id = $("#room_id").val();
      var receive_user_id = $("#receive_user_id").val();
      App.room.speak(content, room_id, receive_user_id);
      $(".chat-input").val("")
    };
  });
});