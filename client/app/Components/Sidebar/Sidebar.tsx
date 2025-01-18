import React from "react";
import Profile from "../Profile/Profile";
import RadialChart from "../RadialChart/RadialChart";
import { useUserContext } from "@/context/userContext";

function Sidebar() {
  const { logoutUser } = useUserContext();
  return (
    <div
      className="w-[20rem] max-w-full h-full fixed right-0 top-0 bottom-0 bg-[#f9f9f9] flex flex-col overflow-y-auto"
      style={{ maxHeight: "100vh" }}
    >
      <Profile />
      <div className="mt-4 mx-6">
        <RadialChart />
      </div>

      <button
        className="mt-auto mb-6 mx-6 py-4 px-8 bg-[#EB4E31] text-white rounded-[50px] hover:bg-[#3aafae] transition duration-200 ease-in-out"
        onClick={logoutUser}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Sidebar;
