import { useState } from "react";
import SideNav from "../../components/SideNav/SideNav";
import Dashboard from "../../components/Dashboard/Dashboard";

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
        <Dashboard />
      </main>
    </div>
  );
};

export default Admin;
