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

// router.ws('/chat', async (ws) => {
//   let id = crypto.randomUUID() as string | '';
//   activeConnections[id] = ws;
//   ws.send(JSON.stringify({
//     type: "ONLINE_USERS",
//     payload: await User.find({online: true}),
//   }));
//
//   const messages = await Messages.find().sort({_id: -1}).limit(30).populate('author', 'displayName');
//   ws.on('close', () => {
//     console.log('client disconnected! id=', id);
//     User.findOneAndUpdate({username: id}, {online: false})
//     Object.keys(activeConnections).forEach(connId => {
//       const conn = activeConnections[connId];
//       conn.send(JSON.stringify({
//         type: 'OFFLINE',
//         payload: id
//       }));
//     });
//     delete activeConnections[id];
//   });
//
//   ws.on('message', async (msg) => {
//     const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
//
//     if (decodedMessage.type === 'LOGIN') {
//       try {
//         const login = decodedMessage.payload as UserMutation;
//         const user = await User.findOneAndUpdate({username: login.username}, {online: true});
//
//         if (!user) {
//           ws.send(JSON.stringify({type: 'ERROR', payload: "Username not found"}));
//         }
//         else if (activeConnections[user.username]) {
//           ws.send(JSON.stringify({type: 'ERROR', payload: "Username already online"}));
//         }
//         const isMatch = await user?.checkPassword(login.password);
//         if (!isMatch) {
//           ws.send(JSON.stringify({type: 'ERROR', payload: "Password is wrong"}));
//         }
//         user?.generateToken();
//         await user?.save();
//         ws.send(JSON.stringify({
//           type: 'LOGIN',
//           payload: user
//         }));
//         delete activeConnections[id];
//         id = user?.username;
//         activeConnections[id] = ws;
//         ws.send(JSON.stringify({
//           type: 'EXISTING_MESSAGES',
//           payload: messages,
//         }));
//         ws.send(JSON.stringify({
//           type: "ONLINE_USERS",
//           payload: await User.find({online: true}),
//         }));
//         Object.keys(activeConnections).forEach(id => {
//           if (id === user?.username) return;
//           const conn = activeConnections[id];
//           conn.send(JSON.stringify({
//             type: 'NEW_ONLINE',
//             payload: user
//           }));
//         });
//       } catch (e) {
//         ws.send(JSON.stringify(e));
//       }
//     } else if (decodedMessage.type === 'OFFLINE') {
//       try {
//         await User.findOneAndUpdate({username: decodedMessage.payload}, {online: false})
//         Object.keys(activeConnections).forEach(id => {
//           const conn = activeConnections[id];
//           conn.send(JSON.stringify({
//             type: 'OFFLINE',
//             payload: decodedMessage.payload
//           }));
//         });
//       } catch (e) {
//         ws.send(JSON.stringify(e));
//       }
//
//     } else if (decodedMessage.type === 'REGISTRATION') {
//       const register = decodedMessage.payload as UserMutation;
//       try {
//         const user = new User({
//           username: register.username,
//           password: register.password,
//           displayName: register.displayName,
//           online: true,
//         });
//         user.generateToken();
//         await user.save();
//         ws.send(JSON.stringify({
//           type: 'LOGIN',
//           payload: user
//         }));
//         delete activeConnections[id];
//         id = user.username;
//         activeConnections[user.username] = ws;
//         ws.send(JSON.stringify({
//           type: 'EXISTING_MESSAGES',
//           payload: messages,
//         }));
//         ws.send(JSON.stringify({
//           type: "ONLINE_USERS",
//           payload: await User.find({online: true}),
//         }));
//         Object.keys(activeConnections).forEach(id => {
//           if (id === user.username) return;
//           const conn = activeConnections[id];
//           conn.send(JSON.stringify({
//             type: 'NEW_ONLINE',
//             payload: user
//           }));
//         });
//       } catch (error) {
//         ws.send(JSON.stringify(error));
//       }
//
//     } else if (decodedMessage.type === 'SEND_MESSAGE') {
//       try {
//         const messagePayload = decodedMessage.payload as MessageType;
//         const message = new Messages({
//           author: messagePayload.author,
//           text: messagePayload.text,
//         })
//         await message.save();
//         const author = await User.findOne({_id: messagePayload.author});
//         Object.keys(activeConnections).forEach(id => {
//           const conn = activeConnections[id];
//           conn.send(JSON.stringify({
//             type: 'NEW_MESSAGE',
//             payload: {
//               author: author,
//               text: messagePayload.text,
//             }
//           }));
//         });
//       } catch (error) {
//         ws.send(JSON.stringify(error));
//       }
//
//     } else if (decodedMessage.type === 'DELETE_MESSAGE') {
//       decodedMessage.payload as string;
//       try {
//         await Messages.deleteOne({_id: decodedMessage.payload});
//         Object.keys(activeConnections).forEach(id => {
//           const conn = activeConnections[id];
//           conn.send(JSON.stringify({
//             type: 'DELETE_MESSAGE',
//             payload: decodedMessage.payload
//           }))
//         });
//       } catch (error) {
//         ws.send(JSON.stringify(error));
//       }
//
//     } else {
//       console.log('Unknown message type:', decodedMessage.type);
//     }
//
//   });
// });

app.use(router);
void run();