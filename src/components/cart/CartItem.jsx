import { useState } from 'react';
import useCartStore from '../../store/cartStore';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCartStore();
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    return (
        <div className="flex items-center py-5 border-b border-gray-200">
            <div className="flex-shrink-0 w-24 h-24">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                            className="mx-2 w-16 text-center border-gray-300 rounded-md"
                        />
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">
                            R$ {(item.price * quantity).toFixed(2)}
                        </p>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-600 hover:text-red-500"
                        >
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 