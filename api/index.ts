import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from 'crypto';
import mongoose from "mongoose";
import userRouter from './routers/users';
import {ActiveConnections, IncomingMessage, MessageType} from "./types";
import Messages from "./models/Messages";
import User from "./models/User";
import config from "./config";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);

const router = express.Router();

const activeConnections: ActiveConnections = {};

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
    console.log('disconnected!');
  });
};

router.ws('/chat', async (ws) => {
  let id = crypto.randomUUID() as string | '';
  activeConnections[id] = ws;

  ws.on('message', async (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

    if (decodedMessage.type === 'SEND_MESSAGE') {
      try {
        const messagePayload = decodedMessage.payload as MessageType;
        const message = new Messages({
          author: messagePayload.author,
          text: messagePayload.text,
        })
        await message.save();
        const author = await User.findOne({_id: messagePayload.author});
        Object.keys(activeConnections).forEach(id => {
          const conn = activeConnections[id];
          conn.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {
              author: author,
              text: messagePayload.text,
            }
          }));
        });
      } catch (error) {
        ws.send(JSON.stringify(error));
      }

    } else {
      console.log('Unknown message type:', decodedMessage.type);
    }

  });
});

app.use(router);
void run();