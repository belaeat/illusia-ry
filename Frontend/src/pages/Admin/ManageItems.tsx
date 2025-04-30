import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Item } from "../../types/types";

const ManageItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/items");
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError(error.message || "Failed to load items");
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/items/${itemId}`);
      toast.success("Item deleted successfully!");
      setItems(items.filter((item) => item._id !== itemId));
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || "Failed to delete item");
    }
  };

  const handleToggleAvailability = async (
    itemId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/items/${itemId}`,
        {
          isAvailable: !currentStatus,
        }
      );
      setItems(
        items.map((item) => (item._id === itemId ? response.data : item))
      );
      toast.success(
        `Item marked as ${!currentStatus ? "available" : "unavailable"}`
      );
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || "Failed to update item availability");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setEditForm({
      description: item.description,
      contentSummary: item.contentSummary,
      storageDetails: item.storageDetails,
      storageLocation: item.storageLocation,
      isAvailable: item.isAvailable,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await axios.put(
        `http://localhost:5001/api/items/${editingItem._id}`,
        editForm
      );
      setItems(
        items.map((item) =>
          item._id === editingItem._id ? response.data : item
        )
      );
      setEditingItem(null);
      toast.success("Item updated successfully!");
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || "Failed to update item");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">📦 Manage Items</h1>
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
                  📝 <strong>Content:</strong> {item.contentSummary}
                </p>
                <p className="text-gray-600 mt-2">
                  📦 <strong>Storage:</strong> {item.storageDetails}
                </p>
                <p className="text-gray-600 mt-2">
                  📍 <strong>Location:</strong>{" "}
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

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    handleToggleAvailability(item._id, item.isAvailable)
                  }
                  className="flex-1 bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-[#9537c7] text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-[#44195b] text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3EC3BA] focus:ring-[#3EC3BA]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content Summary
                </label>
                <textarea
                  name="contentSummary"
                  value={editForm.contentSummary || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3EC3BA] focus:ring-[#3EC3BA]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Details
                </label>
                <input
                  type="text"
                  name="storageDetails"
                  value={editForm.storageDetails || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3EC3BA] focus:ring-[#3EC3BA]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={editForm.storageLocation || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3EC3BA] focus:ring-[#3EC3BA]"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={editForm.isAvailable || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#3EC3BA] focus:ring-[#3EC3BA] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Available
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#3EC3BA] text-white rounded-md hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
