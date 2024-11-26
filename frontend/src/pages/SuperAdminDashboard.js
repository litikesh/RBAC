import React, { useContext } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { UserContext } from "../context/UserContext";

const SuperAdminDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-48 mb-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
          <p className="text-3xl font-semibold text-white">
            Welcome, {user?.username}
          </p>
        </div>

        <div className="p-6 bg-gray-50 shadow-sm rounded-lg">
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            As a Super Admin, you have the following capabilities:
          </p>
          <ul className="mt-2 space-y-2 list-disc list-inside text-gray-600">
            <li>Assign roles to users and promote them as needed.</li>
            <li>Grant access to other admins with specific permissions:</li>
            <ul className="pl-6 list-disc list-inside">
              <li>
                <strong>View:</strong> Allow access to view specific content or
                data.
              </li>
              <li>
                <strong>Delete:</strong> Permit deletion of records or content.
              </li>
              <li>
                <strong>Modify:</strong> Enable editing and updating of
                information.
              </li>
            </ul>
            <li>
              Block users who violate policies or breach security protocols.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
