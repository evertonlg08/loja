import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useFavoritesStore from '../../store/favoritesStore';

export default function Navbar() {
    const { user, signOut } = useAuthStore();
    const { favorites } = useFavoritesStore();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary-600">
                                Loja Esportiva
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Início
                            </Link>
                            <Link
                                to="/produtos"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Produtos
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/favoritos"
                                    className="text-gray-500 hover:text-gray-700 relative"
                                >
                                    Favoritos
                                    {favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to="/pedidos"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Meus Pedidos
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {user.displayName || user.email}
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                                >
                                    Cadastrar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 