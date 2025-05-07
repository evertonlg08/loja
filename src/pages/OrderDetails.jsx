import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                const docRef = doc(db, 'orders', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error('Pedido não encontrado');
                }

                const orderData = {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate()
                };

                if (orderData.userId !== user.uid) {
                    throw new Error('Você não tem permissão para ver este pedido');
                }

                setOrder(orderData);
            } catch (err) {
                console.error('Erro ao buscar pedido:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/pedidos')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Voltar para pedidos
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>Pedido #{order.id.slice(-6)} | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        to="/pedidos"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                        <svg
                            className="mr-2 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Voltar para pedidos
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Pedido #{order.id.slice(-6)}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Realizado em {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'pending' && 'Pendente'}
                                {order.status === 'processing' && 'Processando'}
                                {order.status === 'shipped' && 'Enviado'}
                                {order.status === 'delivered' && 'Entregue'}
                                {order.status === 'cancelled' && 'Cancelado'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Informações de Entrega
                                </h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Nome:</span> {order.fullName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {order.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Telefone:</span> {order.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Endereço:</span> {order.address}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Cidade:</span> {order.city}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Estado:</span> {order.state}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">CEP:</span> {order.zipCode}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Informações de Pagamento
                                </h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Método:</span>{' '}
                                        {order.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                                        {order.paymentMethod === 'pix' && 'PIX'}
                                        {order.paymentMethod === 'boleto' && 'Boleto Bancário'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Itens do Pedido
                            </h2>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-center object-cover rounded-md"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Quantidade: {item.quantity}
                                            </p>
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
                                    <p className="text-gray-900">R$ {order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <p className="text-gray-500">Frete</p>
                                    <p className="text-gray-900">R$ 10.00</p>
                                </div>
                                <div className="flex justify-between text-base font-medium mt-4">
                                    <p className="text-gray-900">Total</p>
                                    <p className="text-gray-900">
                                        R$ {(order.total + 10).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 