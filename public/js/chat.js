const socket = io();

const params = $.deparam(window.location.search);
socket.on("connect", function() {
  socket.emit("join", params, err => {
    if (err) {
      alert(err);
      window.location.href = "/chatroom.html";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

socket.on("updateUserList", function(users) {
  console.log("User List", users);
  const ol = $("<ol></ol>");
  users.forEach(user => {
    ol.append($("<li></li>").text(user));
  });
  $("#users").html(ol);
});

socket.on("newMsg", function(msg) {
  const formattedTime = moment(msg.createdAt).format("h: mm a");

  // add the new message to the container
  msgContainer = document.getElementById("message-container");

  // check if the message sent was by the current user
  var classToAdd;
  console.log("params.username:");
  console.log(params.username);
  console.log("msg.from");
  console.log(msg.from);

  if(params.username === msg.from){
    classToAdd = "from-user";
  } else{
    classToAdd = "to-user";
  }

  msgContainer.innerHTML += 
    '<div class="z-depth-1 chat-messages ' + classToAdd 
    + '"> <span class="timestamp">' + formattedTime 
    + "</span><p>" + msg.text + '</p></div>';

  // msgContainer.innerHTML +=
  //   '<div class="chat-messages > <span class="username">' +
  //   params.username +
  //   "</span><p>" +
  //   msg.text +
  //   '</p><p class="timestamp">' +
  //   formattedTime +
  //   "</p></div>";

  // scroll to the bottom when a new message is sent
  var elem = document.getElementById("chat-wrapper");
  elem.scrollTop = elem.scrollHeight;
});

$("#message-form").on("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMsg",
    {
      from: params.username,
      text: $("[name=message]").val()
    },
    () => {}
  );
});
