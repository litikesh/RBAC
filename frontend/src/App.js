import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AllAdmins from "./pages/AllUsers/AllAdmins";
import AllUsers from "./pages/AllUsers/AllUsers";
import Logs from "./pages/Logs/Logs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "superadmin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/admin-management"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AllAdmins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-logs"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <Logs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
