import { FaUsers, FaClipboardList, FaRegEnvelopeOpen } from "react-icons/fa";

const Dashboard = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#2a2a2a]">Dashboard Overview</h2>

      {/* Decorative line */}
      <div className="w-16 h-1 bg-[#9537c7] rounded-full mt-2 mb-6"></div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <FaClipboardList className="text-3xl text-[#9537c7]" />
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h3 className="text-xl font-semibold text-[#2a2a2a]">320</h3>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <FaUsers className="text-3xl text-[#3EC3BA]" />
          <div>
            <p className="text-sm text-gray-500">Users</p>
            <h3 className="text-xl font-semibold text-[#2a2a2a]">87</h3>
          </div>
        </div>

        {/* All Requests */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <FaRegEnvelopeOpen className="text-3xl text-[#9537c7]" />
          <div>
            <p className="text-sm text-gray-500">All Requests</p>
            <h3 className="text-xl font-semibold text-[#2a2a2a]">45</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
