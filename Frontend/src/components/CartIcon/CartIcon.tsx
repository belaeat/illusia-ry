import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartIcon: React.FC = () => {
    const totalItems = useAppSelector((state) => state.cart.items.length);

    return (
        <Link to="/cart" className="relative">
            <div className="relative">
                <FiShoppingCart className="w-6 h-6 text-[#3EC3BA] transition-colors" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#3EC3BA] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default CartIcon; 