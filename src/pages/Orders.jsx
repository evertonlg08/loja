import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';

export default function Orders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const ordersQuery = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(ordersQuery);
                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                }));

                setOrders(ordersData);
            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
                setError('Erro ao carregar pedidos. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

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

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'processing':
                return 'Em processamento';
            case 'shipped':
                return 'Enviado';
            case 'delivered':
                return 'Entregue';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
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
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Meus Pedidos | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>

                {orders.length === 0 ? (
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pedido encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Faça seu primeiro pedido na nossa loja.
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
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Pedido #{order.id.slice(-6)}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {order.createdAt?.toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 mt-6 pt-6">
                                        <div className="flow-root">
                                            <ul className="-my-6 divide-y divide-gray-200">
                                                {order.items.map((item) => (
                                                    <li key={item.id} className="py-6 flex">
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
                                                                    Quantidade: {item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 mt-6 pt-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Total</p>
                                            <p>R$ {order.total.toFixed(2)}</p>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Frete: R$ {order.shipping.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            to={`/pedidos/${order.id}`}
                                            className="flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                                        >
                                            Ver detalhes do pedido
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
} 