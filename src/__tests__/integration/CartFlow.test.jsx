import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Cart from '../../pages/Cart';
import Checkout from '../../pages/Checkout';

// Mock dos stores
jest.mock('../../store/cartStore');
jest.mock('../../store/authStore');

describe('Fluxo do Carrinho', () => {
    const mockItems = [
        {
            id: '1',
            name: 'Produto 1',
            price: 99.99,
            quantity: 1,
            image: 'produto1.jpg'
        },
        {
            id: '2',
            name: 'Produto 2',
            price: 149.99,
            quantity: 2,
            image: 'produto2.jpg'
        }
    ];

    beforeEach(() => {
        useCartStore.mockReturnValue({
            items: mockItems,
            removeFromCart: jest.fn(),
            updateQuantity: jest.fn(),
            clearCart: jest.fn()
        });

        useAuthStore.mockReturnValue({
            user: { uid: '123', email: 'teste@teste.com' }
        });
    });

    it('deve mostrar os itens do carrinho corretamente', () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );

        expect(screen.getByText('Produto 1')).toBeInTheDocument();
        expect(screen.getByText('Produto 2')).toBeInTheDocument();
        expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
        expect(screen.getByText('R$ 299,98')).toBeInTheDocument();
    });

    it('deve atualizar a quantidade do item', () => {
        const { updateQuantity } = useCartStore();

        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );

        const increaseButton = screen.getAllByRole('button', { name: /aumentar/i })[0];
        fireEvent.click(increaseButton);
        expect(updateQuantity).toHaveBeenCalledWith('1', 2);
    });

    it('deve remover item do carrinho', () => {
        const { removeFromCart } = useCartStore();

        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );

        const removeButton = screen.getAllByRole('button', { name: /remover/i })[0];
        fireEvent.click(removeButton);
        expect(removeFromCart).toHaveBeenCalledWith('1');
    });

    it('deve navegar para o checkout e mostrar formulário', async () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
    });

    it('deve mostrar resumo do pedido no checkout', () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        expect(screen.getByText('Resumo do pedido')).toBeInTheDocument();
        expect(screen.getByText('R$ 399,97')).toBeInTheDocument(); // Subtotal
        expect(screen.getByText('R$ 15,00')).toBeInTheDocument(); // Frete
        expect(screen.getByText('R$ 414,97')).toBeInTheDocument(); // Total
    });
}); 