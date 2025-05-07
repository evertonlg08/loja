import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import CartItem from '../components/cart/CartItem';

export default function Cart() {
    const { items, total, clearCart } = useCartStore();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Seu carrinho está vazio</h2>
                    <p className="mt-2 text-gray-500">
                        Adicione alguns produtos para começar suas compras
                    </p>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="mt-4 btn btn-primary"
                    >
                        Ver produtos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-7">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="mt-10 lg:mt-0 lg:col-span-5">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Resumo do Pedido
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Subtotal</p>
                                <p className="text-gray-900 font-medium">
                                    R$ {total.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-gray-600">Frete</p>
                                <p className="text-gray-900 font-medium">Grátis</p>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <p className="text-lg font-medium text-gray-900">Total</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        R$ {total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn btn-primary w-full"
                            >
                                Finalizar Compra
                            </button>

                            <button
                                onClick={clearCart}
                                className="btn btn-secondary w-full"
                            >
                                Limpar Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 