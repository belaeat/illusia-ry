import { useEffect, useState } from "react";

interface Item {
  _id: string;
  name: string;
  location: string;
  description: string;
}

const placeholderImage =
  "https://via.placeholder.com/300x200.png?text=Item+Image";

const GridItem = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch("http://localhost:5001/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.slice(0, visibleCount).map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
          >
            <img
              src={placeholderImage}
              alt="Placeholder"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-[#2a2a2a] text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.location}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button className="bg-[#3EC3BA] text-white font-semibold py-2 w-full rounded-b-md hover:opacity-90 transition">
              Add to cart
            </button>
          </div>
        ))}
      </div>

      {visibleCount < items.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-[#3EC3BA] text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default GridItem;
