import { useState } from "react";
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
        {/* Next: Dashboard & BookableItems */}
      </main>
    </div>
  );
};

export default Admin;
