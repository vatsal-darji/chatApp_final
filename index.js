const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Message = require("./models/user");
const authRouter = require("./routes/authRoutes");
const bodyParser = require("body-parser");
// const verifyToken = require("./middleware/verifyToken");
// const jwt = require("jsonwebtoken");
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting up the static files
app.use("/index", express.static(path.join(__dirname, "public"))); //"index" is wrtten to only access the chatapp on /index route only

const botName = "Vatsy the Bot";

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/register.html"));
});

//run when client connects
io.on("connection", (socket) => {
  //to dislay room and username
  socket.on("joinRoom", async ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    // Load previous messages from the database
    const messages = await Message.find({ room: user.room })
      .sort({ _id: 1 })
      .limit(10);
    messages.forEach((message) => {
      socket.emit("chat-message", message);
    });

    //welcome note
    socket.emit("chat-message", formatMessage(botName, "Welcome to ChatCord"));

    //broadcast that user has connected
    socket.broadcast.to(user.room).emit(
      //broadcasting to the room
      "chat-message",
      formatMessage(botName, `${user.username} has joined the chat`)
    );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  //to display messages on the screen
  socket.on("chat-message", async (message) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      //save the message to mongoDB
      const newMessage = new Message({
        username: user.username,
        text: message,
        time: formatMessage(user.username, message).time,
        room: user.room,
      });
      await newMessage.save();

      io.to(user.room).emit(
        "chat-message",
        formatMessage(user.username, message)
      );
    }
  });
  //broadcast when a user has disconnected

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "chat-message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use("/", authRouter);

const PORT = 9000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
