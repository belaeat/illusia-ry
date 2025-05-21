import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import BookingModal from "../BookingModal/BookingModal";
import { Item } from "../../types/types";

// ——— Add these interfaces ———
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
  items: BookingItem[];
  status: string;
  createdAt: string;
}

const FeaturedItems = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // ——— NEW: state for all approved bookings ———
  const [allBookings, setAllBookings] = useState<BookingRequest[]>([]);

  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/items/featured"
        );
        setFeaturedItems(response.data);
      } catch {
        setError("Failed to load featured items");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  // ——— NEW: fetch all approved bookings for calendar disabling ———
  useEffect(() => {
    const fetchAllBookings = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token, skipping bookings fetch");
      return;
    }

    const res = await axios.get<BookingRequest[]>(
      "http://localhost:5001/api/booking-requests?status=approved",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // if you’re using cookies
      }
    );

    setAllBookings(res.data);
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};

    fetchAllBookings();
  }, []);

  const handleBookItem = (item: Item) => {
    if (!user) {
      toast.info("Please login to book items");
      navigate("/login");
      return;
    }
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3EC3BA]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (featuredItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No featured items available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl text-white font-bold">Featured Items</h1>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full"
          >
            <div className="flex-grow space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.description}
              </h2>
              <p className="text-sm text-gray-600">
                <strong>Content:</strong> {item.contentSummary}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Storage:</strong> {item.storageDetails}
              </p>
              {item.storageLocation && (
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {item.storageLocation}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={item.isAvailable ? "Available" : "Not Available"}
                />
                <span className="text-sm text-gray-600">
                  {item.isAvailable ? "Available" : "Not Available"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleBookItem(item)}
              disabled={!item.isAvailable}
              className={`
                btn btn-sm
                w-auto
                px-6
                mt-4
                mx-auto
                ${
                  item.isAvailable
                    ? "border-gray-400 text-gray-700 hover:bg-gray-100"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
            >
              {item.isAvailable ? "Book This Item" : "Not Available"}
            </button>
          </div>
        ))}
      </div>


      {selectedItem && (
        <BookingModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          allBookings={allBookings}      // ← pass your fetched bookings here
        />
      )}
    </div>
  );
};

export default FeaturedItems;
