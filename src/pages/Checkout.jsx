import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, clearCart } = useCartStore();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                userId: user.uid,
                items,
                total: items.reduce((total, item) => total + (item.price * item.quantity), 0),
                status: 'pending',
                ...formData,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'orders'), orderData);
            clearCart();
            navigate(`/pedidos/${docRef.id}`);
        } catch (err) {
            console.error('Erro ao processar pedido:', err);
            setError('Erro ao processar seu pedido. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    return (
        <>
            <Helmet>
                <title>Checkout | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Informações de Entrega</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
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
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            />
                                        </div>
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Método de Pagamento</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="credit_card"
                                            name="paymentMethod"
                                            value="credit_card"
                                            checked={formData.paymentMethod === 'credit_card'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                        />
                                        <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                                            Cartão de Crédito
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="pix"
                                            name="paymentMethod"
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
                                            type="radio"
                                            id="boleto"
                                            name="paymentMethod"
                                            value="boleto"
                                            checked={formData.paymentMethod === 'boleto'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                        />
                                        <label htmlFor="boleto" className="ml-3 block text-sm font-medium text-gray-700">
                                            Boleto Bancário
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : 'Finalizar Pedido'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo do Pedido</h2>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-center object-cover rounded-md"
                                            />
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-6">
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-500">Subtotal</p>
                                    <p className="text-gray-900">R$ {subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <p className="text-gray-500">Frete</p>
                                    <p className="text-gray-900">R$ {shipping.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium mt-4">
                                    <p className="text-gray-900">Total</p>
                                    <p className="text-gray-900">R$ {total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 