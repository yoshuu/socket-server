const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  // 前端觀眾加入某個 room
  socket.on("join_viewer", ({ room }) => {
    socket.join(`viewer:${room}`);
    console.log(`Viewer joined room: ${room}`);
  });

  // live_translation 丟來的字幕
  socket.on("subtitle", (payload) => {
    const room = payload.room || "default";
    // 把字幕轉發給這個 room 底下所有觀眾
    io.to(`viewer:${room}`).emit("subtitle", payload);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
