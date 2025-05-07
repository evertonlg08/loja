import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function CustomerTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const testimonialsRef = collection(db, 'testimonials');
                const q = query(
                    testimonialsRef,
                    orderBy('createdAt', 'desc'),
                    limit(3)
                );
                const querySnapshot = await getDocs(q);
                const testimonialsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTestimonials(testimonialsList);
            } catch (error) {
                console.error('Erro ao buscar depoimentos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    O que nossos clientes dizem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                O que nossos clientes dizem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {testimonial.name}
                                </h3>
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center mb-4">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-5 h-5 ${index < testimonial.rating
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-600">{testimonial.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 