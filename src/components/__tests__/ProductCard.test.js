import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

const mockProduct = {
    id: '1',
    name: 'Tênis Nike Air Max',
    price: 599.90,
    image: 'test-image.jpg',
    category: 'Tênis',
    brand: 'Nike',
    description: 'Tênis Nike Air Max para corrida',
};

const mockAddToCart = jest.fn();

describe('ProductCard', () => {
    beforeEach(() => {
        mockAddToCart.mockClear();
    });

    it('deve renderizar o componente corretamente', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        expect(screen.getByText(`R$ ${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
        expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
        expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
        expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
    });

    it('deve chamar onAddToCart quando o botão for clicado', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

        const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('deve mostrar o preço formatado corretamente', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

        const priceElement = screen.getByText(`R$ ${mockProduct.price.toFixed(2)}`);
        expect(priceElement).toBeInTheDocument();
    });

    it('deve mostrar a imagem do produto com o alt text correto', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

        const imageElement = screen.getByAltText(mockProduct.name);
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute('src', mockProduct.image);
    });

    it('deve mostrar a categoria e marca do produto', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

        expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
        expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    });
}); 