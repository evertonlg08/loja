import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useAuthStore from '../../store/authStore';

export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });
    const { user } = useAuthStore();

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('productId', '==', productId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const reviewsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsList);
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Por favor, faça login para deixar uma avaliação');
            return;
        }

        try {
            const reviewsRef = collection(db, 'reviews');
            await addDoc(reviewsRef, {
                productId,
                userId: user.uid,
                userName: user.displayName || 'Usuário',
                rating: newReview.rating,
                comment: newReview.comment,
                createdAt: serverTimestamp()
            });

            setNewReview({
                rating: 5,
                comment: ''
            });
            fetchReviews();
        } catch (error) {
            console.error('Erro ao adicionar avaliação:', error);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Avaliações</h3>
                <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <svg
                                key={index}
                                className={`w-5 h-5 ${index < Math.round(averageRating)
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
                    <p className="ml-2 text-sm text-gray-500">
                        {reviews.length} avaliações
                    </p>
                </div>
            </div>

            {user && (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sua Avaliação
                        </label>
                        <div className="mt-1 flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setNewReview(prev => ({ ...prev, rating: index + 1 }))}
                                    className="focus:outline-none"
                                >
                                    <svg
                                        className={`w-8 h-8 ${index < newReview.rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                            Seu Comentário
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows={4}
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Enviar Avaliação
                    </button>
                </form>
            )}

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                    <svg
                                        key={index}
                                        className={`w-5 h-5 ${index < review.rating
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
                            <p className="ml-2 text-sm text-gray-500">
                                {review.userName}
                            </p>
                            <p className="ml-2 text-sm text-gray-500">
                                {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                            </p>
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 