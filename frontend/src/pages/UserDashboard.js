import React from "react";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          User Dashboard
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Welcome, User! Explore the features and tools available to you. Enjoy
          your personalized experience.
        </p>
      </div>
    </>
  );
};

export default UserDashboard;
