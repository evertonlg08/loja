import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import AdvancedSearch from '../components/search/AdvancedSearch';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const category = searchParams.get('categoria');
    const brand = searchParams.get('marca');
    const search = searchParams.get('busca');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                let productsQuery = collection(db, 'products');

                // Aplicar filtros
                if (category) {
                    productsQuery = query(productsQuery, where('category', '==', category));
                }
                if (brand) {
                    productsQuery = query(productsQuery, where('brand', '==', brand));
                }
                if (search) {
                    productsQuery = query(
                        productsQuery,
                        where('name', '>=', search),
                        where('name', '<=', search + '\uf8ff')
                    );
                }

                // Ordenar por data de criação
                productsQuery = query(productsQuery, orderBy('createdAt', 'desc'));

                const snapshot = await getDocs(productsQuery);
                const productsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, brand, search]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
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

    return (
        <>
            <Helmet>
                <title>Produtos | Loja Esportiva</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {category ? `Produtos - ${category}` :
                            brand ? `Produtos - ${brand}` :
                                search ? `Resultados para "${search}"` :
                                    'Todos os Produtos'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                    </p>
                </div>

                {products.length === 0 ? (
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Tente ajustar seus filtros ou buscar por outro termo.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
} 