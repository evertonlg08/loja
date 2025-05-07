import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import ProductReviews from '../components/products/ProductReviews';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { favorites, toggleFavorite } = useFavoritesStore();
    const { addToCart } = useCartStore();

    const isFavorite = favorites.some(fav => fav.id === id);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Produto não encontrado');
                }
            } catch (err) {
                console.error('Erro ao buscar produto:', err);
                setError('Erro ao carregar produto. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        navigate('/carrinho');
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
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

    if (!product) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{product.name} | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Imagem do produto */}
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Detalhes do produto */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="mt-2 text-sm text-gray-500">{product.brand}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">
                                R$ {product.price.toFixed(2)}
                            </p>
                            <button
                                onClick={handleToggleFavorite}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                            >
                                <svg
                                    className={`h-6 w-6 ${isFavorite ? 'text-red-500' : ''}`}
                                    fill={isFavorite ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Descrição</h3>
                            <p className="mt-2 text-base text-gray-500">{product.description}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Quantidade</h3>
                            <div className="mt-2 flex items-center">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>

                {/* Avaliações */}
                <div className="mt-16">
                    <ProductReviews productId={id} />
                </div>
            </div>
        </>
    );
} 