import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import BookingModal from "../BookingModal/BookingModal";
import { Item } from "../../types/types";

const FeaturedItems = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/items/featured"
        );
        setFeaturedItems(response.data);
        setLoading(false);
      } catch {
        setError("Failed to load featured items");
        setLoading(false);
      }
    };

    fetchFeaturedItems();
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
            className="bg-gray-100 rounded-xl shadow p-5 flex flex-col h-full"
          >
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.description}
                  </h2>
                </div>
                <p className="text-gray-600 mt-2">
                  <strong>Content:</strong> {item.contentSummary}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Storage:</strong> {item.storageDetails}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Location:</strong>{" "}
                  {item.storageLocation || "Not specified"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={item.isAvailable ? "Available" : "Not Available"}
                  ></div>
                  <span className="text-gray-600">
                    {item.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleBookItem(item)}
                  className={`w-full border border-[#3EC3BA] text-[#3EC3BA] px-4 py-2 rounded transition-all duration-300 ease-in-out ${
                    item.isAvailable
                      ? "hover:bg-[#3EC3BA] hover:text-white cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? "Book This Item" : "Not Available"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <BookingModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default FeaturedItems;
