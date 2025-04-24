import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddItems = () => {
  const [formData, setFormData] = useState({
    description: "",
    contentSummary: "",
    storageDetails: "",
    storageLocation: "",
    isAvailable: true,
    featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAdd = async () => {
    if (!formData.description.trim() || !formData.contentSummary.trim() || !formData.storageDetails.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/items", formData);
      toast.success("Item added successfully!");
      setFormData({
        description: "",
        contentSummary: "",
        storageDetails: "",
        storageLocation: "",
        isAvailable: true,
        featured: false,
      });
    } catch {
      toast.error("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-4xl font-bold mb-10 text-center">📦 Add an Item</h1>
      <div className="space-y-6">
        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter item description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-[#3EC3BA] focus:border-transparent"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="contentSummary" className="text-sm font-semibold text-gray-700 mb-1">
              Content Summary *
            </label>
            <input
              type="text"
              id="contentSummary"
              name="contentSummary"
              placeholder="Enter content summary"
              value={formData.contentSummary}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-[#3EC3BA] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="storageDetails" className="text-sm font-semibold text-gray-700 mb-1">
              Storage Details *
            </label>
            <input
              type="text"
              id="storageDetails"
              name="storageDetails"
              placeholder="Enter storage details"
              value={formData.storageDetails}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-[#3EC3BA] focus:border-transparent"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="storageLocation" className="text-sm font-semibold text-gray-700 mb-1">
              Storage Location
            </label>
            <input
              type="text"
              id="storageLocation"
              name="storageLocation"
              placeholder="Enter storage location"
              value={formData.storageLocation}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-[#3EC3BA] focus:border-transparent"
            />
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 text-[#3EC3BA] rounded focus:ring-[#3EC3BA]"
            />
            <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700">
              Available for Booking
            </label>

          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-[#3EC3BA] rounded focus:ring-[#3EC3BA]"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Featured Item
            </label>

          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleAdd}
            className="bg-[#3EC3BA] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2E1A47] transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
