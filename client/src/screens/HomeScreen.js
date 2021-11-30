import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../component/Room";
import Loading from "../component/Loading";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

const { RangePicker } = DatePicker;

const HomeScreen = () => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [duplicateRooms, setDuplicateRooms] = useState([]);

  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getAllRooms")).data;

        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      };
      fetchData();
    } catch (error) {
      setError(true);
      console.log(error);
      setLoading(false);
    }
  }, []);

  const filterByDate = (dates) => {
    setFromDate(moment(dates[0]).format("DD-MM-YYYY"));
    // console.log(dates);
    setToDate(moment(dates[1]).format("DD-MM-YYYY"));

    var tempRooms = [];
    var availability = false;

    for (const room of duplicateRooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              booking.fromDate,
              booking.toDate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              booking.fromDate,
              booking.toDate
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromDate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.toDate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromDate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.toDate
            ) {
              {
                availability = true;
              }
            }
          }
        }
      }
      if (availability === true || room.currentbookings.length === 0) {
        tempRooms.push(room);
      }
      setRooms(tempRooms);
    }
  };

  const filterBySearch = () => {
    const tempRooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setRooms(tempRooms);
  };

  const filterByType = (e) => {
    setType(e);

    if (e !== "all") {
      const tempRooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(tempRooms);
    } else {
      setRooms(duplicateRooms);
    }
  };

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3 ">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5 ">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5 ">
        {loading ? (
          <h1>
            <Loading />
          </h1>
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-2">
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
