import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Loading from "../component/Loading";
import Error from "../component/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000,
});

const BookingScreen = () => {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [room, setRoom] = useState();

  const roomid = params.roomId;
  const fromDate = moment(params.fromDate, "DD-MM-YYYY");
  const toDate = moment(params.toDate, "DD-MM-YYYY");

  const totalDays = moment.duration(toDate.diff(fromDate)).asDays() + 1;
  const [totalAmount, setTotalAmount] = useState();

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.reload = "/login";
    }
    try {
      const fetchData = async () => {
        setLoading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomid: params.roomId,
          })
        ).data;
        setTotalAmount(data.rentperday * totalDays);
        setRoom(data);
        setLoading(false);
      };
      fetchData();
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, [params, totalDays]);

  const onToken = async (token) => {
    const bookingDetails = {
      room,
      userId: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromDate,
      toDate,
      totalAmount,
      totalDays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/bookings";
      });
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", "Someting Went Wrong", "error");
    }
    setLoading(false);
  };

  return (
    <div className="m-5" data-aos="fade-right">
      {loading ? (
        <h1>
          <Loading />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" alt="" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />{" "}
                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                  </p>
                  <p>From Date: {params.fromDate}</p>
                  <p>To Date : {params.toDate} </p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {totalDays} </p>
                  <p>Rent Per Day: {room.rentperday} </p>
                  <p>Total Amount : {totalAmount} </p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency="INR"
                  stripeKey="pk_test_51JzcVNEFtnu5nZOoLTIrQqFDO9mYj7EyFNr5AWw9eUYKyDjmqgQ1bF7bKpVEEnwUtKZ4qKxYZ6WQ3xPYHHAya0sS000lPbLkkg"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default BookingScreen;
