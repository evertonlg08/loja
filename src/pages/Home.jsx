import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProductCard from '../components/products/ProductCard';
import ProductRecommendations from '../components/products/ProductRecommendations';
import FeaturedProducts from '../components/products/FeaturedProducts';
import SpecialOffers from '../components/products/SpecialOffers';
import BrandPartners from '../components/brands/BrandPartners';
import CustomerTestimonials from '../components/testimonials/CustomerTestimonials';
import PromotionalBanner from '../components/promotions/PromotionalBanner';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar produtos em destaque
                const featuredQuery = query(
                    collection(db, 'products'),
                    orderBy('rating', 'desc'),
                    limit(4)
                );
                const featuredSnapshot = await getDocs(featuredQuery);
                const featuredData = featuredSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeaturedProducts(featuredData);

                // Buscar produtos mais recentes
                const newArrivalsQuery = query(
                    collection(db, 'products'),
                    orderBy('createdAt', 'desc'),
                    limit(4)
                );
                const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
                const newArrivalsData = newArrivalsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNewArrivals(newArrivalsData);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                <title>Loja Esportiva - Sua Loja de Artigos Esportivos</title>
            </Helmet>

            {/* Hero Section */}
            <div className="relative bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Bem-vindo à Loja Esportiva
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        Encontre os melhores produtos esportivos com os melhores preços. Qualidade e satisfação garantidas.
                    </p>
                    <div className="mt-10">
                        <Link
                            to="/produtos"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                            Ver produtos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Produtos em Destaque</h2>
                    <Link
                        to="/produtos"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                        Ver todos
                        <span aria-hidden="true"> &rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* New Arrivals */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Novidades</h2>
                        <Link
                            to="/produtos"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                            Ver todos
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorias</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        to="/produtos?categoria=futebol"
                        className="group relative rounded-lg overflow-hidden"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="Futebol"
                            className="w-full h-64 object-cover group-hover:opacity-75 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                            <h3 className="text-xl font-bold text-white">Futebol</h3>
                        </div>
                    </Link>
                    <Link
                        to="/produtos?categoria=basquete"
                        className="group relative rounded-lg overflow-hidden"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1546519638-68e109acd27b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="Basquete"
                            className="w-full h-64 object-cover group-hover:opacity-75 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                            <h3 className="text-xl font-bold text-white">Basquete</h3>
                        </div>
                    </Link>
                    <Link
                        to="/produtos?categoria=tenis"
                        className="group relative rounded-lg overflow-hidden"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="Tênis"
                            className="w-full h-64 object-cover group-hover:opacity-75 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                            <h3 className="text-xl font-bold text-white">Tênis</h3>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Qualidade Garantida</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Todos os nossos produtos são de alta qualidade e garantimos a satisfação do cliente.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Entrega Rápida</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Entregamos seus produtos em tempo recorde para todo o Brasil.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Pagamento Seguro</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Aceitamos diversas formas de pagamento com total segurança.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Promocional */}
            <PromotionalBanner />

            {/* Ofertas Especiais */}
            <SpecialOffers />

            {/* Marcas Parceiras */}
            <BrandPartners />

            {/* Depoimentos */}
            <CustomerTestimonials />

            {/* Recomendações */}
            <ProductRecommendations />

            {/* Benefícios */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: 'Frete Grátis',
                                description:
                                    'Em compras acima de R$ 200,00 para todo o Brasil.'
                            },
                            {
                                title: 'Pagamento Seguro',
                                description:
                                    'Diversas formas de pagamento com total segurança.'
                            },
                            {
                                title: 'Garantia Estendida',
                                description:
                                    'Garantia adicional em produtos selecionados.'
                            }
                        ].map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-white rounded-lg shadow-sm p-6"
                            >
                                <h3 className="text-lg font-medium text-gray-900">
                                    {benefit.title}
                                </h3>
                                <p className="mt-2 text-gray-500">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

const categories = [
    {
        name: 'Futebol',
        slug: 'futebol',
        image: 'https://source.unsplash.com/800x600/?soccer',
    },
    {
        name: 'Academia',
        slug: 'academia',
        image: 'https://source.unsplash.com/800x600/?gym',
    },
    {
        name: 'Corrida',
        slug: 'corrida',
        image: 'https://source.unsplash.com/800x600/?running',
    },
]; 