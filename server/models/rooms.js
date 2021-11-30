import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxcount: {
      type: Number,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    rentperday: {
      type: String,
      required: true,
    },
    imageurls: [],
    currentbookings: [],
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
