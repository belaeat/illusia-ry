import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import { useContext } from 'react';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useContext(AuthContext)!;
    const items = useAppSelector((state) => state.cart.items);
    const totalItems = useAppSelector((state) => state.cart.totalItems);

    const handleRemoveItem = (itemId: string) => {
        if (!user?.email) {
            toast.error('User email not found');
            return;
        }
        dispatch(removeFromCart({ id: itemId, userEmail: user.email }));
        toast.success('Item removed from cart');
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    };

    const handleSubmitBookingRequest = async () => {
        if (!user) {
            toast.error('Please login to submit booking request');
            return;
        }

        if (!user.email) {
            toast.error('User email not found');
            return;
        }

        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/booking-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    items: items.map(item => ({
                        item: item._id,
                        quantity: item.quantity,
                        startDate: item.bookingDates?.startDate,
                        endDate: item.bookingDates?.endDate
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit booking request');
            }

            toast.success('Booking request submitted successfully!');
            dispatch(clearCart({ userEmail: user.email }));
            navigate('/my-bookings');
        } catch (error) {
            console.error('Error submitting booking request:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit booking request. Please try again.');
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 ">
                <h1 className="text-2xl font-bold mb-4 text-white">Your Cart</h1>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600">Your cart is empty</p>
                    <button
                        onClick={() => navigate('/items')}
                        className="mt-4 bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4 text-white">Your Cart ({totalItems} items)</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y">
                    {items.map((item) => (
                        <div key={item._id} className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.description}</h3>
                                <p className="text-sm text-gray-600">{item.contentSummary}</p>
                                {item.bookingDates && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        📅 {new Date(item.bookingDates.startDate).toLocaleDateString()} - {new Date(item.bookingDates.endDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded">
                                    <button
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={() => dispatch(clearCart({}))}
                        className="text-red-500 hover:text-red-700"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={handleSubmitBookingRequest}
                        className="mt-4 bg-[#3EC3BA] text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                        Submit Booking Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart; 