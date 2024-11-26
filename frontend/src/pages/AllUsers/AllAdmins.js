import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Users from "./Users.js";

const AllAdmins = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-50 min-h-screen">
        <div className="p-4 mb-2">
          <Users isSuperAdmin={true} isAdmin={false} isViewAdmins={true} />
        </div>
      </div>
    </div>
  );
};

export default AllAdmins;
