import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function SpecialOffers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialOffers = async () => {
            try {
                const productsRef = collection(db, 'products');
                const q = query(
                    productsRef,
                    where('discount', '>', 0),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const productsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsList);
            } catch (error) {
                console.error('Erro ao buscar ofertas especiais:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialOffers();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Ofertas Especiais
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                        >
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Ofertas Especiais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const discountedPrice = product.price * (1 - product.discount / 100);
                    return (
                        <Link
                            key={product.id}
                            to={`/produtos/${product.id}`}
                            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:opacity-75"
                                />
                                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                                    {product.discount}% OFF
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="mt-2 flex items-center">
                                    <p className="text-lg font-medium text-gray-900">
                                        R$ {discountedPrice.toFixed(2)}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-500 line-through">
                                        R$ {product.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
} 