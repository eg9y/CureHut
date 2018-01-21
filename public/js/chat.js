const socket = io();

socket.on("connect", function() {
  const params = $.deparam(window.location.search);
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
  const template = $("#message-template").html();
  const html = ejs.render(template, {
    from: msg.from,
    text: msg.text,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

$("#message-form").on("submit", e => {
  const params = $.deparam(window.location.search);
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
