const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const PORT = 3002;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});
io.on("connection", (socket) => {

    socket.on("get_rooms", () => {
        let availableRooms = []
        socket.adapter.rooms.forEach((value, roomKey) => {
            // console.log("value", value)
            if (roomKey.search("room/") >= 0) {
                availableRooms.push(roomKey.slice(5));
            }
        });
        socket.broadcast.emit('rooms', availableRooms);
    });

    socket.on("join_room", async (data) => {

        await socket.join(`room/${data.room}`);

        // name = data.user;
        // room = data.room;
    });

    socket.on("addOrder", (data) => {
        console.log(data);



        socket.broadcast.emit("receiveOrder", data);
    });

    // socket.on("disconnect", () => {
    //     console.log(`Disconnect user: ${socket.id}`);
    //     socket.to(`room/${room}`).emit("receive_message", {
    //         author: 'server',
    //         message: `${name} left the room`
    //     });
    // });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));