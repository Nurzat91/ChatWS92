import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  mongoose: {
    // db: 'mongodb://localhost/chatWS',
    db: "mongodb://127.0.0.1:27017/chatWS",
  }
};

export default config;