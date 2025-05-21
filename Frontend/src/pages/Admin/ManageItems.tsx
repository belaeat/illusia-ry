import { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Item } from "../../types/types";
import { ChevronDown } from "lucide-react"; // 🠞 make sure to install lucide-react

const ManageItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (!window.confirm("Are you sure you want to delete this item?")) return;
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
        { isAvailable: !currentStatus }
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

  const toggleDropdown = (itemId: string) => {
    setOpenDropdown((prev) => (prev === itemId ? null : itemId));
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
      <h1 className="text-4xl font-bold mb-6">Manage Items</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Storage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.storageDetails}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.storageLocation || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 relative">
                  <div
                    className="relative inline-block text-left"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => toggleDropdown(item._id)}
                      className="flex items-center gap-1 px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Actions
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {openDropdown === item._id && (
                      <div className="absolute right-0 z-10 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200">
                        <button
                          onClick={() => {
                            handleToggleAvailability(
                              item._id,
                              item.isAvailable
                            );
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.isAvailable
                            ? "Mark Unavailable"
                            : "Mark Available"}
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(item);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(item._id);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal... (unchanged) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <input
                name="description"
                value={editForm.description || ""}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="contentSummary"
                value={editForm.contentSummary || ""}
                onChange={handleInputChange}
                placeholder="Content Summary"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="storageDetails"
                value={editForm.storageDetails || ""}
                onChange={handleInputChange}
                placeholder="Storage Details"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="storageLocation"
                value={editForm.storageLocation || ""}
                onChange={handleInputChange}
                placeholder="Storage Location"
                className="w-full border rounded px-3 py-2"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={editForm.isAvailable || false}
                  onChange={handleInputChange}
                />
                Available
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#3EC3BA] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
// Note: Make sure to adjust the API URL and item properties according to your actual API response structure.
