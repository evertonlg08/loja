import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';

const mockCartItems = [
    {
        id: '1',
        name: 'Tênis Nike Air Max',
        price: 599.90,
        quantity: 1,
        image: 'test-image-1.jpg',
    },
    {
        id: '2',
        name: 'Camiseta Adidas',
        price: 129.90,
        quantity: 2,
        image: 'test-image-2.jpg',
    },
];

const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();
const mockClearCart = jest.fn();

describe('Cart', () => {
    beforeEach(() => {
        mockUpdateQuantity.mockClear();
        mockRemoveItem.mockClear();
        mockClearCart.mockClear();
    });

    it('deve renderizar o carrinho vazio corretamente', () => {
        render(
            <Cart
                items={[]}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        expect(screen.getByText(/seu carrinho está vazio/i)).toBeInTheDocument();
    });

    it('deve renderizar os itens do carrinho corretamente', () => {
        render(
            <Cart
                items={mockCartItems}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        mockCartItems.forEach((item) => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(`R$ ${item.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(item.quantity.toString())).toBeInTheDocument();
        });
    });

    it('deve chamar onUpdateQuantity quando a quantidade for alterada', () => {
        render(
            <Cart
                items={mockCartItems}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        const increaseButtons = screen.getAllByRole('button', { name: /aumentar/i });
        const decreaseButtons = screen.getAllByRole('button', { name: /diminuir/i });

        fireEvent.click(increaseButtons[0]);
        expect(mockUpdateQuantity).toHaveBeenCalledWith(mockCartItems[0].id, mockCartItems[0].quantity + 1);

        fireEvent.click(decreaseButtons[0]);
        expect(mockUpdateQuantity).toHaveBeenCalledWith(mockCartItems[0].id, mockCartItems[0].quantity - 1);
    });

    it('deve chamar onRemoveItem quando o botão de remover for clicado', () => {
        render(
            <Cart
                items={mockCartItems}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        const removeButtons = screen.getAllByRole('button', { name: /remover/i });
        fireEvent.click(removeButtons[0]);

        expect(mockRemoveItem).toHaveBeenCalledWith(mockCartItems[0].id);
    });

    it('deve chamar onClearCart quando o botão de limpar carrinho for clicado', () => {
        render(
            <Cart
                items={mockCartItems}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        const clearButton = screen.getByRole('button', { name: /limpar carrinho/i });
        fireEvent.click(clearButton);

        expect(mockClearCart).toHaveBeenCalled();
    });

    it('deve calcular o total corretamente', () => {
        render(
            <Cart
                items={mockCartItems}
                onUpdateQuantity={mockUpdateQuantity}
                onRemoveItem={mockRemoveItem}
                onClearCart={mockClearCart}
            />
        );

        const total = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        expect(screen.getByText(`R$ ${total.toFixed(2)}`)).toBeInTheDocument();
    });
}); 