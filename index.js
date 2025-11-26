const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  // live_translation 會 emit "hall" 事件
  socket.on("hall", (payload) => {
    console.log("got hall from some client:", payload);

    // 這裡先很暴力：直接 broadcast 給所有連線的人
    io.emit("hall", payload);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket server running at http://127.0.0.1:${PORT}`);
});
