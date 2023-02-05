import { Router } from "express";
import User from "../models/User.js";

const routes = Router();

// creating User
routes.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      res.send("user already Exists");
      return;
    }

    // console.log(req.body);
    const user = await User.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (e) {
    let msg = "";
    if (e.code === 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg);
  }
});

// login user
routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

// logout user

export default routes;
