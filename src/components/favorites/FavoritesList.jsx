import { Link } from 'react-router-dom';
import useFavoritesStore from '../../store/favoritesStore';
import useCartStore from '../../store/cartStore';

export default function FavoritesList() {
    const { favorites, removeFavorite } = useFavoritesStore();
    const { addItem } = useCartStore();

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">
                    Você ainda não tem favoritos
                </h2>
                <p className="mt-2 text-gray-500">
                    Adicione produtos aos favoritos para vê-los aqui
                </p>
                <Link
                    to="/produtos"
                    className="mt-4 inline-block btn btn-primary"
                >
                    Ver produtos
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                    <Link to={`/produtos/${product.id}`}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                    </Link>
                    <div className="p-4">
                        <Link
                            to={`/produtos/${product.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                            {product.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-lg font-medium text-gray-900">
                                R$ {product.price.toFixed(2)}
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => addItem(product)}
                                    className="btn btn-primary"
                                >
                                    Adicionar ao Carrinho
                                </button>
                                <button
                                    onClick={() => removeFavorite(product.id)}
                                    className="btn btn-secondary"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 