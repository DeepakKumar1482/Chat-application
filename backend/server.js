const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./DB/connection.js')

app.use(cors())
app.use(express.json());
const server = http.createServer(app);
connectDB();
app.use('/api/v1/user/', require('./Routes/userRoutes.js'))
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log("A new user has connected", socket.id)
    socket.on("join_room", (data) => {
        socket.join(data)
    })
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })
})

server.listen(3000, () => {
    console.log('listening on 3000')
});