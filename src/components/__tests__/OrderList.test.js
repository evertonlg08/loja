import { render, screen, fireEvent } from '@testing-library/react';
import OrderList from '../OrderList';

const mockOrders = [
    {
        id: '1',
        number: '001',
        date: '2024-03-20',
        status: 'Pendente',
        total: 729.80,
        items: [
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
                quantity: 1,
            },
        ],
    },
    {
        id: '2',
        number: '002',
        date: '2024-03-19',
        status: 'Entregue',
        total: 129.90,
        items: [
            {
                id: '2',
                name: 'Camiseta Adidas',
                price: 129.90,
                quantity: 1,
            },
        ],
    },
];

const mockOnOrderClick = jest.fn();
const mockOnCancelOrder = jest.fn();

describe('OrderList', () => {
    beforeEach(() => {
        mockOnOrderClick.mockClear();
        mockOnCancelOrder.mockClear();
    });

    it('deve renderizar a lista de pedidos corretamente', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        mockOrders.forEach((order) => {
            expect(screen.getByText(`Pedido #${order.number}`)).toBeInTheDocument();
            expect(screen.getByText(order.status)).toBeInTheDocument();
            expect(screen.getByText(`R$ ${order.total.toFixed(2)}`)).toBeInTheDocument();
        });
    });

    it('deve chamar onOrderClick quando um pedido for clicado', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        const orderElement = screen.getByText(`Pedido #${mockOrders[0].number}`);
        fireEvent.click(orderElement);

        expect(mockOnOrderClick).toHaveBeenCalledWith(mockOrders[0]);
    });

    it('deve chamar onCancelOrder quando o botão de cancelar for clicado', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButtons[0]);

        expect(mockOnCancelOrder).toHaveBeenCalledWith(mockOrders[0].id);
    });

    it('deve mostrar o botão de cancelar apenas para pedidos pendentes', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
        expect(cancelButtons).toHaveLength(1);
    });

    it('deve mostrar a data formatada corretamente', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        expect(screen.getByText('20/03/2024')).toBeInTheDocument();
        expect(screen.getByText('19/03/2024')).toBeInTheDocument();
    });

    it('deve mostrar o total formatado corretamente', () => {
        render(
            <OrderList
                orders={mockOrders}
                onOrderClick={mockOnOrderClick}
                onCancelOrder={mockOnCancelOrder}
            />
        );

        expect(screen.getByText('R$ 729,80')).toBeInTheDocument();
        expect(screen.getByText('R$ 129,90')).toBeInTheDocument();
    });
}); 