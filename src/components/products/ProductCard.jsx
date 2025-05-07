import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useCartStore } from '../../store/cartStore';

export default function ProductCard({ product }) {
    const { favorites, toggleFavorite } = useFavoritesStore();
    const { addToCart } = useCartStore();
    const isFavorite = favorites.some(fav => fav.id === product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        toggleFavorite(product);
    };

    return (
        <Link
            to={`/produtos/${product.id}`}
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {product.brand}
                        </p>
                    </div>
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
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-900">
                        R$ {product.price.toFixed(2)}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </Link>
    );
} 