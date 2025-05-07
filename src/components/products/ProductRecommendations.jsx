import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import useAuthStore from '../../store/authStore';

export default function ProductRecommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                let productsQuery;

                if (user) {
                    // Buscar produtos baseados no histórico de pedidos do usuário
                    const ordersQuery = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid)
                    );
                    const ordersSnapshot = await getDocs(ordersQuery);
                    const orderItems = ordersSnapshot.docs.flatMap(doc => doc.data().items);

                    // Agrupar produtos por categoria
                    const categoryCount = orderItems.reduce((acc, item) => {
                        acc[item.category] = (acc[item.category] || 0) + 1;
                        return acc;
                    }, {});

                    // Pegar a categoria mais frequente
                    const favoriteCategory = Object.entries(categoryCount)
                        .sort(([, a], [, b]) => b - a)[0]?.[0];

                    if (favoriteCategory) {
                        productsQuery = query(
                            collection(db, 'products'),
                            where('category', '==', favoriteCategory),
                            limit(4)
                        );
                    }
                }

                // Se não houver usuário ou categoria favorita, buscar produtos mais vendidos
                if (!productsQuery) {
                    productsQuery = query(
                        collection(db, 'products'),
                        where('featured', '==', true),
                        limit(4)
                    );
                }

                const productsSnapshot = await getDocs(productsQuery);
                const products = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setRecommendations(products);
            } catch (error) {
                console.error('Erro ao buscar recomendações:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 rounded-lg animate-pulse h-64"
                    />
                ))}
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recomendados para Você
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((product) => (
                    <Link
                        key={product.id}
                        to={`/produtos/${product.id}`}
                        className="group"
                    >
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.description}
                                </p>
                                <p className="mt-2 text-lg font-medium text-gray-900">
                                    R$ {product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 