export interface LoginMutation {
  username: string;
  password: string;
}
export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
}
export interface User {
  _id: string;
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}
export interface GlobalError {
  error: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface Message {
  _id: string;
  author: User;
  text: string;
}