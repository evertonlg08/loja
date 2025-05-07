import { Helmet } from 'react-helmet-async';
import useFavoritesStore from '../store/favoritesStore';
import ProductCard from '../components/products/ProductCard';

export default function Favorites() {
    const { favorites } = useFavoritesStore();

    return (
        <>
            <Helmet>
                <title>Favoritos | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>

                {favorites.length === 0 ? (
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum favorito</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comece adicionando alguns produtos aos seus favoritos.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
} 