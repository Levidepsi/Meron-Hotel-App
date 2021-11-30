import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../component/Loading";
import Swal from "sweetalert2";
import { Tag } from "antd";

const MyBookings = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rooms = await (
          await axios.post("/api/bookings/getBookingsByUserId", {
            userId: user._id,
          })
        ).data;
        console.log(rooms);
        setBookings(rooms);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  const cancelBooking = async (bookingId, roomId) => {
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/bookings/cancelBooking", {
          bookingId,
          roomId,
        })
      ).data;
      console.log(result);
      setLoading(false);
      Swal.fire("Congrats, Your has been cancelled").then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire("Something went Wrong");
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loading />}
          {bookings &&
            bookings.map((booking) => {
              return (
                <div className="bs">
                  <h1>{booking.room}</h1>
                  <p>
                    <b>BookingId </b>: {booking._id}
                  </p>
                  <p>
                    <b>Check In</b> : {booking.fromDate}
                  </p>
                  <p>
                    <b>Check Out</b> : {booking.toDate}
                  </p>
                  <p>
                    <b>Amount</b> : {booking.totalAmount}
                  </p>
                  <p>
                    <b>Status</b> :{" "}
                    {booking.status === "cancelled" ? (
                      <Tag color="red">Cancelled</Tag>
                    ) : (
                      <Tag color="green">Confirm</Tag>
                    )}
                  </p>
                  {booking.status !== "cancelled" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomId);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
