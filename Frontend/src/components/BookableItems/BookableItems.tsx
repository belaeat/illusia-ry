import { useState, useEffect } from "react";
import axios from "axios";

type Item = {
  _id: string;
  title: string;
  description: string;
};

const BookableItems = ({ isUserMode }: { isUserMode: boolean }) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/items");
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (isUserMode) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [isUserMode]);

  if (!isUserMode) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#2a2a2a]">Bookable Items</h2>
      <div className="w-16 h-1 bg-[#9537c7] rounded-full mt-2 mb-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src="https://via.placeholder.com/150"
              alt={item.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#2a2a2a]">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <button className="mt-4 bg-[#3EC3BA] text-white px-4 py-2 rounded-md hover:opacity-90">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookableItems;
