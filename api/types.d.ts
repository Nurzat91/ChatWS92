import {Model} from "mongoose";
import {WebSocket} from 'ws';

export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  status: boolean;
}

interface UserMethods{
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

export type UserMutation = Omit<UserFields, 'token', 'role'>

export interface ActiveConnections {
  [id: string]: WebSocket
}

export interface MessageType {
  type: string;
  text: string;
  author: string;
}

export interface IncomingMessage {
  type: string;
  payload: string | UserMutation | MessageType;
}