import { useState, useEffect } from "react";
import { FiUsers, FiCalendar } from "react-icons/fi";
import axios from "axios";

// Define interfaces for our data
interface BookingItem {
  item: {
    _id: string;
    description: string;
  };
  quantity: number;
  startDate: string;
  endDate: string;
}

interface BookingRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: BookingItem[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [recentBookings, setRecentBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(true);

  // Fetch total users count
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/users", {
          withCredentials: true,
        });

        if (response.data && response.data.users) {
          setTotalUsers(response.data.users.length);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  // Fetch recent bookings
  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await axios.get(
          "http://localhost:5001/api/booking-requests",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          // Sort by creation date (newest first) and take the 5 most recent
          const sortedBookings = response.data
            .sort(
              (a: BookingRequest, b: BookingRequest) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);

          setRecentBookings(sortedBookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchRecentBookings();
  }, []);

  // Get status color based on booking status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Stats for dashboard
  const stats = [
    {
      title: "Total Users",
      value: loading ? "..." : totalUsers.toLocaleString(),
      icon: <FiUsers className="text-[#3ec3ba]" />,
    },
    {
      title: "Active Bookings",
      value: bookingsLoading
        ? "..."
        : recentBookings
            .filter((b) => b.status === "approved")
            .length.toString(),
      icon: <FiCalendar className="text-[#3ec3ba]" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookingsLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
