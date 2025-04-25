import React, { useState, useContext } from 'react';
import { Item } from '../../types/types';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface BookingModalProps {
    item: Item;
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ item, isOpen, onClose }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const { user } = useContext(AuthContext)!;
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }

        if (!user.email) {
            toast.error('User email not found');
            return;
        }

        if (!startDate || !endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        if (quantity < 1) {
            toast.error('Quantity must be at least 1');
            return;
        }

        // Add to cart with booking dates
        dispatch(addToCart({
            item: {
                ...item,
                quantity,
                bookingDates: {
                    startDate,
                    endDate
                }
            },
            userEmail: user.email
        }));

        toast.success('Item added to cart successfully!');
        onClose();
    };

    // Calculate minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <dialog id="booking_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-2xl mb-4">Book Item</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item Details */}
                    <div className="bg-gray-100 rounded-xl p-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{item.description}</h4>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Content:</span> {item.contentSummary}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Storage:</span> {item.storageDetails}
                        </p>
                        {item.storageLocation && (
                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">Location:</span> {item.storageLocation}
                            </p>
                        )}
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

                    {/* Date Selection and Quantity */}
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={today}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">End Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || today}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Quantity</span>
                            </label>
                            <div className="flex items-center">
                                <button
                                    className="btn btn-circle btn-sm mr-2"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="input input-bordered w-20 text-center"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                />
                                <button
                                    className="btn btn-circle btn-sm ml-2"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button
                        className="btn bg-[#3EC3BA] text-white hover:opacity-90"
                        onClick={handleAddToCart}
                        disabled={!item.isAvailable}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default BookingModal; 