import { Link } from 'react-router-dom';

export default function PromotionalBanner() {
    return (
        <div className="bg-primary-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">Promoção Especial</span>
                            <span className="block text-primary-200">
                                Até 50% de desconto em produtos selecionados
                            </span>
                        </h2>
                        <p className="mt-3 max-w-3xl text-lg text-primary-100">
                            Aproveite nossas ofertas especiais em produtos de alta qualidade.
                            Descontos exclusivos por tempo limitado.
                        </p>
                        <div className="mt-8 flex">
                            <div className="inline-flex rounded-md shadow">
                                <Link
                                    to="/produtos?promocao=true"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                                >
                                    Ver Ofertas
                                </Link>
                            </div>
                            <div className="ml-3 inline-flex">
                                <Link
                                    to="/produtos"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
                                >
                                    Ver Todos os Produtos
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-0">
                        <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                            <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                                <img
                                    className="w-full"
                                    src="/images/promotional-banner.jpg"
                                    alt="Promoção Especial"
                                />
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-4xl font-extrabold text-white">
                                            ATÉ 50% OFF
                                        </p>
                                        <p className="mt-2 text-xl text-white">
                                            Por tempo limitado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 