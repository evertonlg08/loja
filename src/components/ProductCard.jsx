import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                >
                    {product.name}
                </Link>
                <p className="mt-1 text-gray-600">{product.brand}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">
                        R$ {product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => addItem(product)}
                        className="btn btn-primary"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
} 