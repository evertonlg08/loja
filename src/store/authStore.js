import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            loading: true,
            error: null,

            setUser: (user) => set({ user, loading: false }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            signUp: async (email, password) => {
                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    set({ user: userCredential.user, error: null });
                    return userCredential.user;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            signIn: async (email, password) => {
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    set({ user: userCredential.user, error: null });
                    return userCredential.user;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            signOut: async () => {
                try {
                    await signOut(auth);
                    set({ user: null, error: null });
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            initAuth: () => {
                return onAuthStateChanged(auth, (user) => {
                    set({ user, loading: false });
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore; 