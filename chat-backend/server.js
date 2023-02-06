import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./connection.js";
import userRoutes from "./routes/userRoutes.js";

import dotenv from "dotenv";
import Message from "./models/Message.js";
import User from "./models/User.js";
dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// security packages
// import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

const rooms = ["General", "Technology", "Coding", "Crypto"];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       "img-src": ["'self'", "https: data:"],
//     },
//   })
// );

app.use(xss());
app.use(mongoSanitize());

app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "../chat-frontend/build")));
app.use("/api/v1/users", userRoutes);

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// redirecting to front-end index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../chat-frontend/build", "index.html"));
});

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    method: ["GET", "POST"],
  },
});

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  // 20/01/2022  =>  20222001
  return messages.sort(function (a, b) {
    let d1 = a._id.split("/");
    let d2 = b._id.split("/");

    d1 = d1[2] + d1[0] + d1[1];
    d2 = d2[2] + d2[0] + d2[1];

    return d1 < d2 ? -1 : 1;
  });
}

// socket connection
io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom, prevRoom) => {
    socket.join(newRoom);
    socket.leave(prevRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);

    socket.broadcast.emit("notifications", room);
  });

  app.delete("/api/v1/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(PORT, () => {
      console.log(`server is listening at ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
