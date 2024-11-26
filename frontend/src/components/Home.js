import React from "react";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the RBAC App
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          This is a Role-Based Access Control (RBAC) system demonstration. Login
          or register to explore the platform based on your role!
        </p>
      </div>
    </>
  );
};

export default Home;
