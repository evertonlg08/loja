import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ProductRecommendations from '../components/products/ProductRecommendations';
import FeaturedProducts from '../components/products/FeaturedProducts';
import SpecialOffers from '../components/products/SpecialOffers';
import BrandPartners from '../components/brands/BrandPartners';
import CustomerTestimonials from '../components/testimonials/CustomerTestimonials';
import PromotionalBanner from '../components/promotions/PromotionalBanner';

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Loja Esportiva - Sua loja de artigos esportivos</title>
                <meta
                    name="description"
                    content="Encontre os melhores artigos esportivos com os melhores preços. Roupas, calçados e equipamentos das melhores marcas."
                />
            </Helmet>

            <div className="relative">
                {/* Hero Section */}
                <div className="relative bg-gray-900">
                    <div className="absolute inset-0">
                        <img
                            className="w-full h-full object-cover"
                            src="/images/hero-bg.jpg"
                            alt="Background"
                        />
                        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Bem-vindo à Loja Esportiva
                        </h1>
                        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                            Encontre os melhores produtos esportivos com os melhores preços.
                            Qualidade e variedade para todos os esportes.
                        </p>
                        <div className="mt-10">
                            <Link
                                to="/produtos"
                                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700"
                            >
                                Ver Produtos
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Produtos em Destaque */}
                <FeaturedProducts />

                {/* Banner Promocional */}
                <PromotionalBanner />

                {/* Ofertas Especiais */}
                <SpecialOffers />

                {/* Categorias */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Categorias em Destaque
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: 'Futebol',
                                image: '/images/categories/futebol.jpg',
                                href: '/produtos?categoria=futebol'
                            },
                            {
                                name: 'Basquete',
                                image: '/images/categories/basquete.jpg',
                                href: '/produtos?categoria=basquete'
                            },
                            {
                                name: 'Tênis',
                                image: '/images/categories/tenis.jpg',
                                href: '/produtos?categoria=tenis'
                            },
                            {
                                name: 'Corrida',
                                image: '/images/categories/corrida.jpg',
                                href: '/produtos?categoria=corrida'
                            }
                        ].map((category) => (
                            <Link
                                key={category.name}
                                to={category.href}
                                className="group relative rounded-lg overflow-hidden"
                            >
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                                    <h3 className="text-xl font-medium text-white">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

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