import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';

export default function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);
    const { addItem } = useCartStore();
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product);
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        if (isFavorite(product.id)) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    return (
        <Link
            to={`/produtos/${product.id}`}
            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                    />
                </div>

                {/* Botões de ação */}
                <div
                    className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <button
                        onClick={handleAddToCart}
                        className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Adicionar ao Carrinho
                    </button>
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full ${isFavorite(product.id)
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
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

                {/* Badge de desconto */}
                {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                        {product.discount}% OFF
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description}
                </p>

                {/* Avaliação */}
                {product.averageRating > 0 && (
                    <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-4 h-4 ${index < Math.round(product.averageRating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="ml-2 text-sm text-gray-500">
                            ({product.reviewCount || 0})
                        </p>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        {product.discount > 0 ? (
                            <div className="flex items-center">
                                <p className="text-lg font-medium text-gray-900">
                                    R$ {(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </p>
                                <p className="ml-2 text-sm text-gray-500 line-through">
                                    R$ {product.price.toFixed(2)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-lg font-medium text-gray-900">
                                R$ {product.price.toFixed(2)}
                            </p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
            </div>
        </Link>
    );
} 