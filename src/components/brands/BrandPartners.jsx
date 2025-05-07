import { Link } from 'react-router-dom';

const brands = [
    {
        name: 'Nike',
        logo: '/images/brands/nike.png',
        href: '/produtos?marca=nike'
    },
    {
        name: 'Adidas',
        logo: '/images/brands/adidas.png',
        href: '/produtos?marca=adidas'
    },
    {
        name: 'Puma',
        logo: '/images/brands/puma.png',
        href: '/produtos?marca=puma'
    },
    {
        name: 'Under Armour',
        logo: '/images/brands/under-armour.png',
        href: '/produtos?marca=under-armour'
    },
    {
        name: 'New Balance',
        logo: '/images/brands/new-balance.png',
        href: '/produtos?marca=new-balance'
    },
    {
        name: 'Asics',
        logo: '/images/brands/asics.png',
        href: '/produtos?marca=asics'
    }
];

export default function BrandPartners() {
    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Nossas Marcas Parceiras
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            to={brand.href}
                            className="group flex items-center justify-center"
                        >
                            <div className="relative w-32 h-16">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 