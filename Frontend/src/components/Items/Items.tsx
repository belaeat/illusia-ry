import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Item } from "../../types/types";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../providers/AuthProvider";
import { User } from "firebase/auth";
import { toast } from "react-toastify";

// Extend the Firebase User type to include role
interface UserWithRole extends User {
  role?: 'super-admin' | 'admin' | 'user';
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    description: "",
    contentSummary: "",
    storageDetails: "",
    storageLocation: "",
  });
  const authContext = useContext(AuthContext);
  const user = authContext?.user as UserWithRole | null;
  const navigate = useNavigate();

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/items");
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/items/${id}`);
    fetchItems();
  };

  const handleEditStart = (item: Item) => {
    setEditingId(item._id);
    setEditFields({
      description: item.description,
      contentSummary: item.contentSummary,
      storageDetails: item.storageDetails,
      storageLocation: item.storageLocation,
    });
  };

  const handleEditSave = async (id: string) => {
    await axios.put(`http://localhost:5000/api/items/${id}`, editFields);
    setEditingId(null);
    fetchItems();
  };

  const handleBookItem = (item: Item) => {
    if (!user) {
      // User is not logged in (guest user)
      toast.info("Please sign up or log in to book this item");
      navigate("/register");
      return;
    }

    // TODO: Implement booking functionality for logged-in users
    console.log("Booking item:", item);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">📦 All Storage Items</h1>
        {user?.role === 'admin' && (
          <Link
            to="/addItems"
            className="cursor-pointer p-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90"
          >
            Add New Item
          </Link>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-gray-100 rounded-xl shadow p-5 flex flex-col h-full">
            {editingId === item._id ? (
              <div className="space-y-4 flex-grow">
                <div className="flex flex-col">
                  <label htmlFor="editDescription" className="text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="editDescription"
                    value={editFields.description}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editContentSummary" className="text-sm font-semibold text-gray-700 mb-1">
                    Content Summary
                  </label>
                  <input
                    type="text"
                    id="editContentSummary"
                    value={editFields.contentSummary}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        contentSummary: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editStorageDetails" className="text-sm font-semibold text-gray-700 mb-1">
                    Storage Details
                  </label>
                  <input
                    type="text"
                    id="editStorageDetails"
                    value={editFields.storageDetails}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        storageDetails: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editStorageLocation" className="text-sm font-semibold text-gray-700 mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    id="editStorageLocation"
                    value={editFields.storageLocation}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        storageLocation: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleEditSave(item._id)}
                    className="bg-[#9537c7] text-white px-4 py-2 rounded flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-[#3ec3ba] text-white px-4 py-2 rounded flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.description}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    📝 <strong>Content:</strong> {item.contentSummary}
                  </p>
                  <p className="text-gray-600 mt-2">
                    📦 <strong>Storage:</strong> {item.storageDetails}
                  </p>
                  <p className="text-gray-600 mt-2">
                    📍 <strong>Location:</strong> {item.storageLocation}
                  </p>
                </div>
                <div className="mt-auto pt-4 space-y-2">
                  <button
                    onClick={() => handleBookItem(item)}
                    className="w-full bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
                  >
                    Book This Item
                  </button>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(item)}
                        className="flex-1 bg-[#9537c7] text-white px-4 py-2 rounded hover:opacity-90 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:opacity-90 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
