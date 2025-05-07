import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useCartStore from '../store/cartStore';
import useFavoritesStore from '../store/favoritesStore';
import ProductReviews from '../components/products/ProductReviews';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useCartStore();
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);

            const productRef = doc(db, 'products', id);
            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) {
                throw new Error('Produto não encontrado');
            }

            setProduct({
                id: productSnap.id,
                ...productSnap.data()
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            setError('Erro ao carregar produto. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addItem(product);
    };

    const handleToggleFavorite = () => {
        if (isFavorite(product.id)) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
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
                <title>{product.name} - Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Imagem do Produto */}
                    <div className="lg:col-span-1">
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-center object-cover"
                            />
                        </div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            {product.name}
                        </h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Informações do produto</h2>
                            <p className="text-3xl text-gray-900">
                                R$ {product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Descrição</h3>
                            <div className="text-base text-gray-700 space-y-6">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <h3 className="text-sm text-gray-600">Marca:</h3>
                                <p className="ml-2 text-sm text-gray-900">{product.brand}</p>
                            </div>
                            <div className="mt-2 flex items-center">
                                <h3 className="text-sm text-gray-600">Categoria:</h3>
                                <p className="ml-2 text-sm text-gray-900">{product.category}</p>
                            </div>
                        </div>

                        <div className="mt-10 flex sm:flex-col1">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="max-w-xs flex-1 bg-primary-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-full"
                            >
                                Adicionar ao Carrinho
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleFavorite}
                                className={`ml-4 py-3 px-3 rounded-md flex items-center justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isFavorite(product.id)
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg
                                    className={`h-6 w-6 ${isFavorite(product.id) ? 'text-red-600' : 'text-gray-400'
                                        }`}
                                    fill={isFavorite(product.id) ? 'currentColor' : 'none'}
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