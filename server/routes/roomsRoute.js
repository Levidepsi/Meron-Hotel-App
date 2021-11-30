import express from "express";
import Room from "../models/rooms.js";

const router = express.Router();

router.get("/getAllRooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomId = req.body.roomid;
  console.log(roomId);
  try {
    const room = await Room.findOne({ _id: roomId });
    res.send(room);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/addRoom", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();

    res.send("New Room Added Successfully");
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
