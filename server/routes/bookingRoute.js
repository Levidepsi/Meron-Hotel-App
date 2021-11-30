import express from "express";
import Booking from "../models/booking.js";
import Room from "../models/rooms.js";
import moment from "moment";
import stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const loadStripe = await stripe(
  "sk_test_51JzcVNEFtnu5nZOoENEOGMa4Uj9cfDCSYLQttpy02MQxC9SRoAqqnZnAjNznKsxBJXabum9tfuYRj0re7bp0seQE00hAYLiYi5"
);

router.post("/bookroom", async (req, res) => {
  const { room, userId, fromDate, toDate, totalAmount, totalDays, token } =
    req.body;

  try {
    const customer = await loadStripe.customers.create({
      email: token.email,
      source: token.id,
    });
    // console.log(customer);

    const payment = await loadStripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const newBooking = new Booking({
        room: room.name,
        roomId: room._id,
        userId,
        fromDate: moment(fromDate).format("DD-MM-YYYY"),
        toDate: moment(toDate).format("DD-MM-YYYY"),
        totalAmount,
        totalDays,
        transactionId: "1234",
      });

      const booking = await newBooking.save();

      const roomTemp = await Room.findOne({ _id: room._id });

      roomTemp.currentbookings.push({
        bookingId: booking._id,
        fromDate: moment(fromDate).format("DD-MM-YYYY"),
        toDate: moment(toDate).format("DD-MM-YYYY"),
        userId: userId,
        status: booking.status,
      });

      await roomTemp.save();
    }
    res.send("Payment Successfull, Your room is booked");
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/getBookingsByUserId", async (req, res) => {
  const userId = req.body.userId;

  try {
    const booking = await Booking.find({ userId: userId });
    res.json(booking);
    console.log(booking);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/cancelBooking", async (req, res) => {
  const { bookingId, roomId } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingId });

    bookingItem.status = "cancelled";

    await bookingItem.save();

    const room = await Room.findOne({ _id: roomId });

    const bookings = room.currentbookings;

    const temp = bookings.filter(
      (booking) => booking.bookingId.toString() !== bookingId
    );

    room.currentbookings = temp;

    await room.save();

    res.send("Your bookings is cancelled");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getAllBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
