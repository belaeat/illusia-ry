import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface BookingItem {
  item: {
    _id: string;
    description: string;
    contentSummary: string;
    storageDetails: string;
    storageLocation?: string;
  };
  quantity: number;
  startDate: string;
  endDate: string;
}

interface BookingRequest {
  _id: string;
  user: {
    email: string;
    name?: string;
  };
  items: BookingItem[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const BookingRequests = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const response = await fetch(
        "http://localhost:5001/api/booking-requests/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      console.log("Booking data:", data); // Debug log
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load booking requests");
      console.error("Error fetching booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/booking-requests/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Booking request ${newStatus}`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3EC3BA]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-4xl font-bold mb-10">Booking Requests</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No booking requests found.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-gray-100 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Booking Request
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Requested by:</span>{" "}
                    {booking.user.email}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </div>
              </div>

              {booking.items &&
                booking.items.map((bookingItem, index) => (
                  <div
                    key={index}
                    className="border-t border-gray-200 pt-4 mt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {bookingItem.item.description}
                        </h3>
                        <p className="text-gray-600">
                          <span className="font-medium">Content:</span>{" "}
                          {bookingItem.item.contentSummary}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Storage:</span>{" "}
                          {bookingItem.item.storageDetails}
                        </p>
                        {bookingItem.item.storageLocation && (
                          <p className="text-gray-600">
                            <span className="font-medium">Location:</span>{" "}
                            {bookingItem.item.storageLocation}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <span className="font-medium">Quantity:</span>{" "}
                          {bookingItem.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Start Date:</span>{" "}
                          {new Date(bookingItem.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">End Date:</span>{" "}
                          {new Date(bookingItem.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="mt-4 text-gray-600">
                <p>
                  <span className="font-medium">Requested:</span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>

              {booking.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn bg-green-500 text-white hover:opacity-90"
                    onClick={() => handleStatusUpdate(booking._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn bg-red-500 text-white hover:opacity-90"
                    onClick={() => handleStatusUpdate(booking._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
