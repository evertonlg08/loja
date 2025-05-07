import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function UserProfile() {
    const { user, signOut } = useAuthStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        // TODO: Implementar atualização do perfil
        setIsEditing(false);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Perfil do Usuário
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Informações pessoais e preferências
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.email}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <form onSubmit={handleUpdateProfile} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="btn btn-secondary"
                                            >
                                                Cancelar
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>{user.displayName || 'Não definido'}</span>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-primary-600 hover:text-primary-500"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <button
                            onClick={handleSignOut}
                            className="btn btn-danger"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 