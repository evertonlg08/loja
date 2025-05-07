import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

const mockUser = {
    name: 'João Silva',
    email: 'joao@teste.com',
};

const mockCartItems = [
    {
        id: '1',
        name: 'Tênis Nike Air Max',
        price: 599.90,
        quantity: 1,
    },
    {
        id: '2',
        name: 'Camiseta Adidas',
        price: 129.90,
        quantity: 2,
    },
];

const mockOnLogout = jest.fn();
const mockOnCartClick = jest.fn();

describe('Header', () => {
    beforeEach(() => {
        mockOnLogout.mockClear();
        mockOnCartClick.mockClear();
    });

    it('deve renderizar o header corretamente quando o usuário não está logado', () => {
        render(
            <Header
                user={null}
                cartItems={[]}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        expect(screen.getByText(/loja esportiva/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
    });

    it('deve renderizar o header corretamente quando o usuário está logado', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        expect(screen.getByText(/loja esportiva/i)).toBeInTheDocument();
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Total de itens no carrinho
    });

    it('deve chamar onLogout quando o botão de sair for clicado', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        const logoutButton = screen.getByRole('button', { name: /sair/i });
        fireEvent.click(logoutButton);

        expect(mockOnLogout).toHaveBeenCalled();
    });

    it('deve chamar onCartClick quando o botão do carrinho for clicado', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        const cartButton = screen.getByRole('button', { name: /carrinho/i });
        fireEvent.click(cartButton);

        expect(mockOnCartClick).toHaveBeenCalled();
    });

    it('deve mostrar o número correto de itens no carrinho', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        const totalItems = mockCartItems.reduce((acc, item) => acc + item.quantity, 0);
        expect(screen.getByText(totalItems.toString())).toBeInTheDocument();
    });

    it('deve mostrar o menu de navegação corretamente', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        expect(screen.getByText(/produtos/i)).toBeInTheDocument();
        expect(screen.getByText(/pedidos/i)).toBeInTheDocument();
    });

    it('deve mostrar o menu de usuário quando o nome for clicado', () => {
        render(
            <Header
                user={mockUser}
                cartItems={mockCartItems}
                onLogout={mockOnLogout}
                onCartClick={mockOnCartClick}
            />
        );

        const userNameButton = screen.getByText(mockUser.name);
        fireEvent.click(userNameButton);

        expect(screen.getByText(/meus pedidos/i)).toBeInTheDocument();
        expect(screen.getByText(/meu perfil/i)).toBeInTheDocument();
    });
}); 