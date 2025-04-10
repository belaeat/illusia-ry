import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./itemManager.css";

type Item = {
  _id: string;
  description: string;
  contentSummary: string;
  storageDetails: string;
  storageLocation: string;
};

const ItemManager: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [description, setDescription] = useState('');
  const [contentSummary, setContentSummary] = useState('');
  const [storageDetails, setStorageDetails] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editFields, setEditFields] = useState({
    description: '',
    contentSummary: '',
    storageDetails: '',
    storageLocation: '',
  });

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/items');
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!description.trim() || !contentSummary.trim()) return;

    await axios.post('http://localhost:5000/api/items', {
      description,
      contentSummary,
      storageDetails,
      storageLocation,
    });

    setDescription('');
    setContentSummary('');
    setStorageDetails('');
    setStorageLocation('');
    fetchItems();
  };

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

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-4xl font-bold mb-10 text-center">📦 Storage Items</h1>

      {/* Add Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1">Description</label>
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
          <label htmlFor="contentSummary" className="text-sm font-semibold text-gray-700 mb-1">Content Summary</label>
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
          <label htmlFor="storageDetails" className="text-sm font-semibold text-gray-700 mb-1">Storage Details</label>
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
          <label htmlFor="storageLocation" className="text-sm font-semibold text-gray-700 mb-1">Storage Location</label>
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
      >
        Add Item
      </button>

      {/* List */}
      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li key={item._id} className="p-5 bg-gray-100 rounded-xl shadow">
            {editingId === item._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="editDescription" className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    id="editDescription"
                    value={editFields.description}
                    onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editContentSummary" className="text-sm font-semibold text-gray-700 mb-1">Content Summary</label>
                  <input
                    type="text"
                    id="editContentSummary"
                    value={editFields.contentSummary}
                    onChange={(e) => setEditFields({ ...editFields, contentSummary: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editStorageDetails" className="text-sm font-semibold text-gray-700 mb-1">Storage Details</label>
                  <input
                    type="text"
                    id="editStorageDetails"
                    value={editFields.storageDetails}
                    onChange={(e) => setEditFields({ ...editFields, storageDetails: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="editStorageLocation" className="text-sm font-semibold text-gray-700 mb-1">Storage Location</label>
                  <input
                    type="text"
                    id="editStorageLocation"
                    value={editFields.storageLocation}
                    onChange={(e) => setEditFields({ ...editFields, storageLocation: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
                  <button
                    onClick={() => handleEditSave(item._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">{item.description}</h2>
                <p className="text-gray-600">📝 <strong>Content:</strong> {item.contentSummary}</p>
                <p className="text-gray-600">📦 <strong>Storage:</strong> {item.storageDetails}</p>
                <p className="text-gray-600">📍 <strong>Location:</strong> {item.storageLocation}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEditStart(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemManager;
