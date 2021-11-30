import express from "express";
import User from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const newUser = new User(req.body);

  try {
    const user = await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };

      res.send(temp);
    } else {
      res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
