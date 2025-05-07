import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

export default function Cart() {
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();
    const [isOpen, setIsOpen] = useState(false);

    const total = items.reduce((acc, item) => {
        const price = item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return acc + price * item.quantity;
    }, 0);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(itemId, newQuantity);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {items.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Carrinho de Compras</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-8">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Carrinho vazio</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Adicione alguns produtos ao seu carrinho.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flow-root">
                                    <ul className="-my-6 divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <li key={item.id} className="py-6 flex">
                                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                </div>

                                                <div className="ml-4 flex-1 flex flex-col">
                                                    <div>
                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                <Link to={`/produtos/${item.id}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </h3>
                                                            <p className="ml-4">
                                                                R$ {((item.discount > 0
                                                                    ? item.price * (1 - item.discount / 100)
                                                                    : item.price) * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {item.brand}
                                                        </p>
                                                    </div>
                                                    <div className="flex-1 flex items-end justify-between text-sm">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="mx-2 text-gray-500">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <div className="flex">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="font-medium text-primary-600 hover:text-primary-500"
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>R$ {total.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Frete calculado no checkout.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            to="/checkout"
                                            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                                        >
                                            Finalizar Compra
                                        </Link>
                                    </div>
                                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                        <p>
                                            ou{' '}
                                            <button
                                                type="button"
                                                className="text-primary-600 font-medium hover:text-primary-500"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    clearCart();
                                                }}
                                            >
                                                Limpar Carrinho
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 