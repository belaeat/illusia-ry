import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddItems = () => {
  const [description, setDescription] = useState("");
  const [contentSummary, setContentSummary] = useState("");
  const [storageDetails, setStorageDetails] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  const handleAdd = async () => {
    if (!description.trim() || !contentSummary.trim()) return;

    await axios.post("http://localhost:5000/api/items", {
      description,
      contentSummary,
      storageDetails,
      storageLocation,
    });

    toast.success("Item added successfully!");

    setDescription("");
    setContentSummary("");
    setStorageDetails("");
    setStorageLocation("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-4xl font-bold mb-10 text-center">📦 Add an Item</h1>
      {/* Add Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="contentSummary"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Content Summary
          </label>
          <input
            type="text"
            id="contentSummary"
            placeholder="Content Summary"
            value={contentSummary}
            onChange={(e) => setContentSummary(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="storageDetails"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Storage Details
          </label>
          <input
            type="text"
            id="storageDetails"
            placeholder="Storage Details"
            value={storageDetails}
            onChange={(e) => setStorageDetails(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="storageLocation"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Storage Location
          </label>
          <input
            type="text"
            id="storageLocation"
            placeholder="Storage Location"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="cursor-pointer w-full py-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90"
      >
        Add Item
      </button>
    </div>
  );
};

export default AddItems;
