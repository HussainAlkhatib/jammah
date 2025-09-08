import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const words = ["apple", "banana", "orange", "grape", "strawberry"];
const gameStates = {}; // { sessionCode: { currentWord: "...", maskedWord: "..." } }

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-session", (sessionCode) => {
    socket.join(sessionCode);
    console.log(`User ${socket.id} joined session ${sessionCode}`);
    if (gameStates[sessionCode]) {
      socket.emit("game-state", gameStates[sessionCode]);
    }
  });

  socket.on("start-round", (sessionCode) => {
    const word = words[Math.floor(Math.random() * words.length)];
    gameStates[sessionCode] = {
      currentWord: word,
      maskedWord: "_ ".repeat(word.length),
    };
    io.to(sessionCode).emit("new-round", gameStates[sessionCode]);
  });

  socket.on("guess", async ({ sessionCode, guess, userId }) => {
    const gameState = gameStates[sessionCode];
    if (gameState && guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
      const gameSession = await prisma.gameSession.findUnique({ where: { code: sessionCode } });
      if (gameSession) {
        const player = await prisma.player.findFirst({ where: { userId, gameSessionId: gameSession.id } });
        if (player) {
          await prisma.player.update({
            where: { id: player.id },
            data: { score: { increment: 10 } }, // Award 10 points for a correct guess
          });
        }
      }
      io.to(sessionCode).emit("round-winner", { winnerId: userId });
      // Reset the word for the next round
      delete gameState.currentWord;

      // Fetch updated players and emit to all clients
      const updatedGameSession = await prisma.gameSession.findUnique({
        where: { code: sessionCode },
        include: { players: { include: { user: true }, orderBy: { score: 'desc' } } },
      });
      io.to(sessionCode).emit("update-players", updatedGameSession.players);
    } else {
      socket.emit("wrong-guess");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Socket.io server listening on port ${port}`);
});
