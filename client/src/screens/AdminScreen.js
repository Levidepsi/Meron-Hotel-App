import React, { useEffect } from "react";
import { Tabs } from "antd";
import { AddRoom, Bookings, Rooms, Users } from "../component/Bookings";

const AdminScreen = () => {
  const { TabPane } = Tabs;
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);
  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h1 className="text-center">
        <b>Admin Panel</b>
      </h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <AddRoom />
        </TabPane>
        <TabPane tab="Users List" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminScreen;
