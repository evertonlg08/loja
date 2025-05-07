import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-primary-600">Loja Esportiva</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/produtos"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                            >
                                Produtos
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Link
                            to="/carrinho"
                            className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 