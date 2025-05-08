import { useEffect, useState, useContext } from "react";
import { Item } from "../../types/types";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";
import BookingModal from "../BookingModal/BookingModal";

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    fetchItems();
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

  const handleBookItem = (item: Item) => {
    if (!user) {
      toast.info("Please login to book items");
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
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

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl text-white font-bold">All Items</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
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
              <div className="mt-auto pt-4 space-y-2">
                <button
                  onClick={() => handleBookItem(item)}
                  className="w-full bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default Items;
