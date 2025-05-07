import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

    const subtotal = items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + shipping;

    return (
        <>
            <Helmet>
                <title>Carrinho | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho</h1>

                {items.length === 0 ? (
                    <div className="text-center py-12">
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
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Seu carrinho está vazio</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comece a adicionar produtos ao seu carrinho.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/produtos"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                            >
                                Ver produtos
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="border-t border-gray-200 divide-y divide-gray-200">
                                {items.map((item) => (
                                    <div key={item.id} className="py-6 flex">
                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover object-center"
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
                                                        R$ {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {item.brand}
                                                </p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="p-1 text-gray-400 hover:text-gray-500"
                                                    >
                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <span className="mx-2 text-gray-600">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 text-gray-400 hover:text-gray-500"
                                                    >
                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="font-medium text-primary-600 hover:text-primary-500"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={clearCart}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                                >
                                    Limpar carrinho
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
                                <h2 className="text-lg font-medium text-gray-900">Resumo do pedido</h2>
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Subtotal</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            R$ {subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Frete</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            R$ {shipping.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <p className="text-base font-medium text-gray-900">Total</p>
                                        <p className="text-base font-medium text-gray-900">
                                            R$ {total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        to="/checkout"
                                        className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Finalizar compra
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 