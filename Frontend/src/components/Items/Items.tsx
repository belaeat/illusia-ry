import axios from "axios";
import { useEffect, useState } from "react";
import { Item } from "../../types/types";
import { Link } from "react-router";


const Items = () => {
    const [items, setItems] = useState<Item[]>([]);
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

            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">📦 All Storage Items</h1>
                <Link
                    to="/addItems"
                    className="cursor-pointer p-2 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90"
                >
                    Add New Item
                </Link>
            </div>

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
                                    <label htmlFor="editStorageLocation" className="text-sm font-semibold text  -gray-700 mb-1">Storage Location</label>
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
                                        className="bg-[#9537c7] text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-[#3ec3ba] text-white px-4 py-2 rounded"
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
                                        className="bg-[#9537c7] text-white px-4 py-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-[#3ec3ba] text-white px-4 py-2 rounded"
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
    )
}

export default Items