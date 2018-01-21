const params = $.deparam(window.location.search);

const chatIsDone = () => {
  alert("Time is Up :(");
  // window.location.assign("http://localhost:3000/feedback");
  window.location.assign("https://aqueous-coast-83469.herokuapp.com/feedback");
};
let timer = 10;

const startTheTimer = () => {
  socket.emit(
    "createMsg",
    {
      from: "Admin",
      text: "Timer have started!"
    },
    () => {}
  );
  setTimeout(chatIsDone, 600000);

  function jpTimer() {
    var secTime = 0,
      minTime = 0,
      hourTime = 0;

    setInterval(function() {
      var maxSec = 59,
        maxMin = 59,
        maxHour = 59;

      if (secTime > maxSec) {
        minTime++;
        if (minTime > maxMin) {
          hourTime++;
          if (hourTime > maxHour) {
            hourTime = 0;
            minTime = 0;
            secTime = 0;
          }
          minTime = 0;
        }
        secTime = 0;
      }

      var newSec = secTime.toString().length == 1 ? "0" + secTime : secTime,
        newMin = minTime.toString().length == 1 ? "0" + minTime : minTime,
        newHour = hourTime.toString().length == 1 ? "0" + hourTime : hourTime;

      document.getElementById("timerDiff").innerHTML =
        newHour + ":" + newMin + ":" + newSec;
      document.getElementById("timer").innerHTML =
        newHour + ":" + newMin + ":" + newSec;

      secTime++;
    }, 1000);
  }

  jpTimer();
};

const socket = io();
socket.on("connect", function() {
  socket.emit("join", params, err => {
    if (err) {
      alert(err);
      window.location.href = "/chatroom";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

socket.on("sendDetails", (roomDetails, roomname) => {
  const theRoom = roomDetails.filter(room => {
    return room.room === roomname;
  })[0];
  if (theRoom.count === 2) {
    startTheTimer();
  }
});

socket.on("updateUserList", function(users) {
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

  if (params.username === msg.from) {
    classToAdd = "from-user";
  } else {
    classToAdd = "to-user";
  }

  if (msg.from === "Admin") {
    classToAdd += " from-admin";
  }

  msgContainer.innerHTML +=
    '<div class="z-depth-1 chat-messages ' +
    classToAdd +
    '"> <span class="username">' +
    msg.from +
    ' @ </span> <span class="timestamp">' +
    formattedTime +
    "</span><p>" +
    msg.text +
    "</p></div>";

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

$("#leave").click(() => {
  socket.emit(
    "createMsg",
    {
      from: "Admin",
      text: "A User has quit"
    },
    () => {}
  );
});
