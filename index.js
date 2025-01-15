const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*", // Du erlaubst alle Ursprünge
    methods: ["GET", "POST"],
  })
); // CORS für HTTP-Requests in Express

app.get("/api/data", (req, res) => {
  res.send({ msg: "message" });
});
/* app.use("/api", routes); */

//Hier wird ein HTTP-Server mit Express erstellt. Der Server wird später von Socket.IO verwendet. : Erzeugt eine neue Instanz des Socket.IO-Servers und verbindet ihn mit dem HTTP-Server.
const server = createServer(app);

//Einrichten des WebSocket-Servers (Socket.IO) hier auch cors für websocket-verbindungen über socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Start listening to events

io.on("connection", (socket) => {
  console.log(`user with socket id:  ${socket.id} connected`);

  socket.on("send_message", (msg) => {
    console.log("message", msg);
    /*   socket.broadcast.emit("receive_message", msg); */
    socket.to(msg.room).emit("receive_message", msg.message);
  });

  /*   socket.on("disconnect", (socket) => {
    console.log("user disconnected", socket.id);
  }); */

  socket.on("join_room", (room) => {
    socket.join(room);
  });
});
/* setupWebSocket(server); */

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
