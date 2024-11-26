import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Users from "./Users.js";
import { UserContext } from "../../context/UserContext.js";

const AllUsers = () => {
  const { user } = useContext(UserContext);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect to update state based on the user's role
  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") {
        setIsSuperAdmin(true);
        setIsAdmin(false);
      } else if (user.role === "admin") {
        setIsAdmin(true);
        setIsSuperAdmin(false);
      } else {
        setIsSuperAdmin(false);
        setIsAdmin(false);
      }
    }
  }, [user]); // Depend on user
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-50 min-h-screen">
        <div className="p-4 mb-2">
          <Users isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
