import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import useAuthStore from './authStore';

const useOrdersStore = create(
    persist(
        (set, get) => ({
            orders: [],
            loading: false,
            error: null,

            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            createOrder: async (orderData) => {
                const { user } = useAuthStore.getState();
                if (!user) throw new Error('Usuário não autenticado');

                try {
                    set({ loading: true });
                    const orderRef = await addDoc(collection(db, 'orders'), {
                        ...orderData,
                        userId: user.uid,
                        createdAt: new Date().toISOString(),
                        status: 'pending'
                    });

                    set((state) => ({
                        orders: [...state.orders, { id: orderRef.id, ...orderData }],
                        loading: false
                    }));

                    return orderRef.id;
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            fetchOrders: async () => {
                const { user } = useAuthStore.getState();
                if (!user) throw new Error('Usuário não autenticado');

                try {
                    set({ loading: true });
                    const q = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    const orders = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    set({ orders, loading: false });
                    return orders;
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            getOrderById: (orderId) => {
                return get().orders.find(order => order.id === orderId);
            }
        }),
        {
            name: 'orders-storage'
        }
    )
);

export default useOrdersStore; 