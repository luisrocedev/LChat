const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");

    socket.on("mensaje", (data) => {
        console.log("Mensaje recibido:", data);
        io.emit("mensaje", data);
    });

    socket.on("disconnect", () => {
        console.log("Un usuario se ha desconectado");
    });

    // Manejar la señalización de WebRTC
    socket.on("webrtc-offer", (data) => {
        socket.broadcast.emit("webrtc-offer", data);
    });

    socket.on("webrtc-answer", (data) => {
        socket.broadcast.emit("webrtc-answer", data);
    });

    socket.on("webrtc-candidate", (data) => {
        socket.broadcast.emit("webrtc-candidate", data);
    });
});

server.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
