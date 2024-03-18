import express from "express";
import mongoose from "mongoose";
import User from '../models/User';

const userRouter = express.Router();

userRouter.post('/', async (req, res, next) =>{
  try {
    const user = new User ({
      username: req.body.username,
      displayName: req.body.displayName,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    return res.send(user);
  }catch (e){

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

userRouter.post('/sessions', async (req, res, next) =>{
  try {
    const user = await User.findOne({ username: req.body.username});

    if(!user){
      return res.status(422).send({error: 'Username and password are correct!'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch){
      return res.status(422).send({error: 'Username and password are correct!'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password are correct!', user});
  }catch (e){
    next(e);
  }
});
userRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = {message: 'OK'};

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({token});

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return  next (e);
  }
});

export default userRouter;