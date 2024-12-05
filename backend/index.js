import { Server } from "socket.io";

const io = new Server(8000, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Allowed custom headers
    credentials: true, // Include cookies if needed
  },
});

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (user) => {
    console.log("New User", user);
    users[socket.id] = user;
    socket.broadcast.emit("user-joined", user);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      user: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("userleft", {
        message: `${users[socket.id]} has left the chat`,
      });
      delete users[socket.id];
    }
  });
});
