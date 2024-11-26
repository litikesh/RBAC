import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Logs = () => {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

  if (user.role !== "superadmin") {
    navigate("/");
  }
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("User is not authenticated");
      const response = await fetch(
        "http://localhost:5000/api/auditLogs/superadmin/all-audit-logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      const data = await response.json();
      setLogs(data.auditLogs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-50 min-h-screen">
        <div className="p-4 mb-2">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            System Activity History
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Performed By
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Affected User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log._id || index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {log.action}
                    </th>
                    <td className="px-6 py-4">{log.performedBy}</td>
                    <td className="px-6 py-4">{log.affectedUser}</td>
                    <td className="px-6 py-4">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
