import mongoose from "mongoose";

const DBConn = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://levi123:1234567890@levi.4hu76.mongodb.net/mern-room?retryWrites=true&w=majority"
    );
    console.log(`Database connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default DBConn;
