import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>Página não encontrada - Loja Esportiva</title>
            </Helmet>

            <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-primary-600">404</h1>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">
                        Página não encontrada
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Desculpe, não conseguimos encontrar a página que você está procurando.
                    </p>
                    <div className="mt-6">
                        <Link to="/" className="btn btn-primary">
                            Voltar para a Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 