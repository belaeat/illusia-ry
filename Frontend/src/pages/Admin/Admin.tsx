import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/SideNav/SideNav";

const Admin = () => {
  const [isUserMode, setIsUserMode] = useState(false);

  return (
    <div className="flex">
      <SideNav
        userEmail="admin@illusairy.fi"
        isUserMode={isUserMode}
        onToggleMode={setIsUserMode}
      />
      <main className="flex-1 bg-white p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
