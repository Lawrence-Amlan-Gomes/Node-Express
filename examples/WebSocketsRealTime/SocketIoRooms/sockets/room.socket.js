// Everything Socket.io's room feature does, kept in its own file — same
// "one file owns this concern" idea as a controller.
export function registerRoomHandlers(io) {
  io.on("connection", (socket) => {
    // A client tells the server which real room it wants to join — this
    // is a Socket.io concept layered on top of WebSockets, not part of
    // the raw WebSocket protocol at all.
    socket.on("join-room", (roomName) => {
      socket.join(roomName);
      console.log(`Real socket ${socket.id} joined room "${roomName}"`);
    });

    socket.on("send-to-room", ({ room, message }) => {
      // Broadcasts ONLY to real sockets that joined this specific room —
      // every other connected socket, in a different room, gets nothing
      // at all.
      io.to(room).emit("room-message", { room, message, from: socket.id });
    });
  });
}
