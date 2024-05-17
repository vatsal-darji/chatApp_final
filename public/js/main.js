const form = document.getElementById("chat-form");
const input = document.getElementById("msg");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//join chatroom
socket.emit("joinRoom", { username, room });

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room), outputUsers(users);
});

socket.on("chat-message", (message) => {
  console.log(message);
  outputMessage(message);

  //to auto scroll to latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value;
  socket.emit("chat-message", message);
  console.log("message:", message);
  input.value = "";
});

// this code basically display all the text and messages
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div); //so this will append the div to the chat-messages class
};

//add room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

//add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
};
