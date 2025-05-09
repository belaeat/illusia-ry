import React, { useState, useContext } from 'react';
import { Item } from '../../types/types';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface BookingItem {
    item: {
        _id: string;
        description: string;
        contentSummary: string;
        storageDetails: string;
        storageLocation?: string;
    };
    quantity: number;
    startDate: string;
    endDate: string;
}

interface BookingRequest {
    _id: string;
    items: BookingItem[];
    status: string;
    createdAt: string;
}

interface BookingModalProps {
    item: Item;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: (items: BookingItem[]) => void;
    existingBooking?: BookingRequest;
}

const BookingModal: React.FC<BookingModalProps> = ({
    item,
    isOpen,
    onClose,
    onUpdate,
    existingBooking,
}) => {
    const [startDate, setStartDate] = useState<string>(
        existingBooking?.items[0].startDate || ""
    );
    const [endDate, setEndDate] = useState<string>(
        existingBooking?.items[0].endDate || ""
    );
    const [quantity, setQuantity] = useState<number>(
        existingBooking?.items[0].quantity || 1
    );
    const { user } = useContext(AuthContext)!;
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        if (!user) {
            toast.error("Please login to book items");
            return;
        }

        if (!user.email) {
            toast.error("User email not found");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (quantity < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }

        if (onUpdate && existingBooking) {
            // Update existing booking
            const updatedItems: BookingItem[] = [{
                item: {
                    _id: item._id,
                    description: item.description,
                    contentSummary: item.contentSummary,
                    storageDetails: item.storageDetails,
                    storageLocation: item.storageLocation,
                },
                quantity,
                startDate,
                endDate,
            }];
            onUpdate(updatedItems);
        } else {
            // Add to cart for new booking
            dispatch(
                addToCart({
                    item: {
                        ...item,
                        quantity,
                        bookingDates: {
                            startDate,
                            endDate,
                        },
                    },
                    userEmail: user.email,
                })
            );
            toast.success("Item added to cart successfully!");
            onClose();
        }
    };

    // Calculate minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <dialog id="booking_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-2xl mb-4">
                    {existingBooking ? "Update Booking" : "Book Item"}
                </h3>

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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={today}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || today}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                min="1"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button
                        className="btn bg-[#3EC3BA] text-white hover:opacity-90"
                        onClick={handleSubmit}
                    >
                        {existingBooking ? "Update Booking" : "Add to Cart"}
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