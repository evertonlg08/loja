import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from '../ProductList';

const mockProducts = [
    {
        id: '1',
        name: 'Tênis Nike Air Max',
        price: 599.90,
        image: 'test-image-1.jpg',
        category: 'Tênis',
        brand: 'Nike',
        description: 'Tênis Nike Air Max para corrida',
    },
    {
        id: '2',
        name: 'Camiseta Adidas',
        price: 129.90,
        image: 'test-image-2.jpg',
        category: 'Camisetas',
        brand: 'Adidas',
        description: 'Camiseta Adidas para treino',
    },
    {
        id: '3',
        name: 'Short Under Armour',
        price: 89.90,
        image: 'test-image-3.jpg',
        category: 'Shorts',
        brand: 'Under Armour',
        description: 'Short Under Armour para treino',
    },
];

const mockOnAddToCart = jest.fn();
const mockOnProductClick = jest.fn();

describe('ProductList', () => {
    beforeEach(() => {
        mockOnAddToCart.mockClear();
        mockOnProductClick.mockClear();
    });

    it('deve renderizar a lista de produtos corretamente', () => {
        render(
            <ProductList
                products={mockProducts}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        mockProducts.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(`R$ ${product.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(product.category)).toBeInTheDocument();
            expect(screen.getByText(product.brand)).toBeInTheDocument();
            expect(screen.getByAltText(product.name)).toBeInTheDocument();
        });
    });

    it('deve chamar onAddToCart quando o botão for clicado', () => {
        render(
            <ProductList
                products={mockProducts}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const addButtons = screen.getAllByRole('button', { name: /adicionar ao carrinho/i });
        fireEvent.click(addButtons[0]);

        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('deve chamar onProductClick quando o produto for clicado', () => {
        render(
            <ProductList
                products={mockProducts}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const productElements = screen.getAllByRole('img');
        fireEvent.click(productElements[0]);

        expect(mockOnProductClick).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('deve mostrar mensagem quando não houver produtos', () => {
        render(
            <ProductList
                products={[]}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.getByText(/nenhum produto encontrado/i)).toBeInTheDocument();
    });

    it('deve mostrar o preço formatado corretamente', () => {
        render(
            <ProductList
                products={mockProducts}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.getByText('R$ 599,90')).toBeInTheDocument();
        expect(screen.getByText('R$ 129,90')).toBeInTheDocument();
        expect(screen.getByText('R$ 89,90')).toBeInTheDocument();
    });

    it('deve mostrar a imagem do produto com o alt text correto', () => {
        render(
            <ProductList
                products={mockProducts}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        mockProducts.forEach((product) => {
            const imageElement = screen.getByAltText(product.name);
            expect(imageElement).toBeInTheDocument();
            expect(imageElement).toHaveAttribute('src', product.image);
        });
    });
}); 