import express from "express";
import http from "http";
import { Server } from "socket.io";
import initRoutes from "./controllers/http/index.js";
import initSocket from "./controllers/sockets/index.js";
import './env';
import './db';
import env from './env.js';
import { connectAmqp } from "./message_queue/index.js";
import db from "./db/index.js";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
  pingInterval: 5_000,
});


const main = async () => {

  await connectAmqp().then(async () => {
    console.log('connected to rabbitmq');
    await initRoutes(app)
    await initSocket(io)
  })

  server.listen(env.PORT, () => {
    console.log(`Server listen on PORT: ${env.PORT}`);
  })
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (err) => {
    console.error(err.message)
    await db.$disconnect();
    process.exit(1)
  });
