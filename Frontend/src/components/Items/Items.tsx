import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Item } from "../../types/types";
import { useNavigate } from "react-router";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  const handleBookItem = (item: Item) => {
    if (!user) {
      toast.info('Please login to book items');
      navigate('/login');
      return;
    }

    dispatch(addToCart({
      ...item,
      quantity: 1
    }));

    toast.success('Item added to cart!');
  };

  const handleEditStart = () => {
    // Implement edit functionality
  };

  const handleDelete = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        withCredentials: true
      });
      setItems(items.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3EC3BA]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">📦 All Items</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-gray-100 rounded-xl shadow p-5 flex flex-col h-full">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.description}
                  </h2>
                </div>
                <p className="text-gray-600 mt-2">
                  📝 <strong>Content:</strong> {item.contentSummary}
                </p>
                <p className="text-gray-600 mt-2">
                  📦 <strong>Storage:</strong> {item.storageDetails}
                </p>
                <p className="text-gray-600 mt-2">
                  📍 <strong>Location:</strong> {item.storageLocation || "Not specified"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                    title={item.isAvailable ? 'Available' : 'Not Available'}
                  ></div>
                  <span className="text-gray-600">
                    {item.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4 space-y-2">
                <button
                  onClick={() => handleBookItem(item)}
                  className="w-full bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? 'Book This Item' : 'Not Available'}
                </button>
                {user?.role === 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart()}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
