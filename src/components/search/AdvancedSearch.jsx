import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdvancedSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || ''
    });

    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const productsRef = collection(db, 'products');
                const productsSnapshot = await getDocs(productsRef);
                const products = productsSnapshot.docs.map(doc => doc.data());

                // Extrair categorias e marcas únicas
                const uniqueCategories = [...new Set(products.map(p => p.category))];
                const uniqueBrands = [...new Set(products.map(p => p.brand))];

                setCategories(uniqueCategories);
                setBrands(uniqueBrands);
            } catch (error) {
                console.error('Erro ao buscar categorias e marcas:', error);
            }
        };

        fetchCategoriesAndBrands();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        navigate(`/produtos?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            rating: ''
        });
        navigate('/produtos');
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <form onSubmit={handleSearch} className="space-y-6">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Buscar
                    </label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Digite o nome do produto..."
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Categoria
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Marca
                    </label>
                    <select
                        name="brand"
                        id="brand"
                        value={filters.brand}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="">Todas as marcas</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                            Preço Mínimo
                        </label>
                        <input
                            type="number"
                            name="minPrice"
                            id="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="R$ 0,00"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                            Preço Máximo
                        </label>
                        <input
                            type="number"
                            name="maxPrice"
                            id="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="R$ 0,00"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Avaliação Mínima
                    </label>
                    <select
                        name="rating"
                        id="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="">Todas as avaliações</option>
                        <option value="4">4 estrelas ou mais</option>
                        <option value="3">3 estrelas ou mais</option>
                        <option value="2">2 estrelas ou mais</option>
                        <option value="1">1 estrela ou mais</option>
                    </select>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Buscar
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </form>
        </div>
    );
} 