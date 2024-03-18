import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from 'crypto';
import mongoose from "mongoose";
import userRouter from './routers/users';
import {ActiveConnections, IncomingMessage, MessageType, UserModel, UserMutation} from "./types";
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



app.use(router);
void run();