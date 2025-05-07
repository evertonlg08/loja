import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'credit_card'
    });

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Você precisa estar logado para finalizar a compra.');
            return;
        }

        if (items.length === 0) {
            setError('Seu carrinho está vazio.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const order = {
                userId: user.uid,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                shipping: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                payment: {
                    method: formData.paymentMethod
                },
                subtotal,
                shipping: shipping,
                total,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'orders'), order);
            clearCart();
            navigate('/pedidos');
        } catch (err) {
            console.error('Erro ao criar pedido:', err);
            setError('Erro ao processar pedido. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Checkout | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {/* Informações de entrega */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                Informações de entrega
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                        Nome completo
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Método de pagamento */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                Método de pagamento
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="credit_card"
                                        name="paymentMethod"
                                        type="radio"
                                        value="credit_card"
                                        checked={formData.paymentMethod === 'credit_card'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                                        Cartão de crédito
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="pix"
                                        name="paymentMethod"
                                        type="radio"
                                        value="pix"
                                        checked={formData.paymentMethod === 'pix'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <label htmlFor="pix" className="ml-3 block text-sm font-medium text-gray-700">
                                        PIX
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="boleto"
                                        name="paymentMethod"
                                        type="radio"
                                        value="boleto"
                                        checked={formData.paymentMethod === 'boleto'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <label htmlFor="boleto" className="ml-3 block text-sm font-medium text-gray-700">
                                        Boleto
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        {/* Resumo do pedido */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                Resumo do pedido
                            </h2>
                            <div className="flow-root">
                                <ul className="-my-4 divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="py-4 flex">
                                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    <p className="ml-4 text-sm text-gray-500">
                                                        {item.quantity}x
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    R$ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="text-gray-900">R$ {subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-600">Frete</p>
                                    <p className="text-gray-900">R$ {shipping.toFixed(2)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <p className="text-base font-medium text-gray-900">Total</p>
                                    <p className="text-base font-medium text-gray-900">
                                        R$ {total.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processando...' : 'Finalizar pedido'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
} 