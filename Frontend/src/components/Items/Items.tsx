import { useEffect, useState, useContext } from "react";
import axios from "axios"; // ← added
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Item } from "../../types/types";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";
import BookingModal from "../BookingModal/BookingModal";

// ——— added interfaces ———
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

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(AuthContext)!;

  // Redux filters
  const { searchTerm, category, availability, location } = useSelector(
    (state: RootState) => state.filters
  );

  // ——— new state for all approved bookings ———
  const [allBookings, setAllBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    fetchItems();
    fetchAllBookings(); // ← kick off bookings fetch too
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError("Error loading items. Please try again later.");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ——— new helper to load everyone’s approved bookings ———
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

  const handleBookItem = (item: Item) => {
    if (!user) {
      toast.info("Please login to book items");
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Apply Redux filters to items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contentSummary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !category || item.category?.toLowerCase() === category.toLowerCase();

    const matchesAvailability =
      !availability ||
      (availability === "available" && item.isAvailable) ||
      (availability === "unavailable" && !item.isAvailable);

    const matchesLocation =
      !location ||
      item.storageLocation?.toLowerCase().includes(location.toLowerCase());

    return (
      matchesSearch && matchesCategory && matchesAvailability && matchesLocation
    );
  });

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

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 rounded-2xl">
      {/* <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl text-white font-bold">All Items</h1>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
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
              <p className="text-sm text-gray-600">
                <strong>Location:</strong>{" "}
                {item.storageLocation || "Not specified"}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={item.isAvailable ? "Available" : "Not Available"}
                ></span>
                <span className="text-sm text-gray-600">
                  {item.isAvailable ? "Available" : "Not Available"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleBookItem(item)}
              disabled={!item.isAvailable}
              className={`
                btn btn-sm w-60 mt-4 mx-auto
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          allBookings={allBookings} // ← pass it here
        />
      )}
    </div>
  );
};

export default Items;
