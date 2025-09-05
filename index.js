const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('set username', (username) => {
    socket.username = username; // ✅ corrigido
    console.log(`✅ ${socket.username} se conectou`);
    io.emit('user joined', socket.username);
  });

  socket.on('chat message', (msg) => {
    console.log(`Mensagem de ${socket.username}: ${msg}`);
    io.emit('chat message', { user: socket.username, text: msg });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`❌ ${socket.username} desconectou`);
      io.emit('user left', socket.username);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
