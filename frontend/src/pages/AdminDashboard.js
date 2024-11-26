import React, { useContext } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { UserContext } from "../context/UserContext";

const AdminDashboard = () => {
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

        <div className="p-6 bg-white shadow-sm rounded-lg">
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            As an Admin, you have the following capabilities:
          </p>
          <ul className="mt-2 space-y-2 list-disc list-inside text-gray-600">
            <li>
              View users only if the Super Admin has enabled this permission.
            </li>
            <li>
              If you have the <strong>Delete</strong> permission, you can delete
              a user from the database.
            </li>
            <li>
              With <strong>Modify</strong> permission, you can edit user
              information.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
