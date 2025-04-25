import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';

const Cart = () => {
    const { items, totalItems } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeFromCart(itemId));
        toast.success('Item removed from cart');
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    };

    const handleCheckout = () => {
        if (!user) {
            toast.info('Please login to proceed with checkout');
            navigate('/login');
            return;
        }
        // TODO: Implement checkout functionality
        toast.info('Checkout functionality coming soon!');
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
                        onClick={() => dispatch(clearCart())}
                        className="text-red-500 hover:text-red-700"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="bg-[#3EC3BA] text-white px-6 py-2 rounded hover:opacity-90 transition"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart; 