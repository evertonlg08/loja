import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useCartStore } from '../../store/cartStore';

// Mock dos stores
jest.mock('../../store/favoritesStore');
jest.mock('../../store/cartStore');

describe('ProductCard', () => {
    const mockProduct = {
        id: '1',
        name: 'Produto Teste',
        price: 99.99,
        brand: 'Marca Teste',
        image: 'teste.jpg'
    };

    beforeEach(() => {
        useFavoritesStore.mockReturnValue({
            favorites: [],
            toggleFavorite: jest.fn()
        });

        useCartStore.mockReturnValue({
            addToCart: jest.fn()
        });
    });

    it('deve renderizar o produto corretamente', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        expect(screen.getByText('Produto Teste')).toBeInTheDocument();
        expect(screen.getByText('Marca Teste')).toBeInTheDocument();
        expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
        expect(screen.getByAltText('Produto Teste')).toHaveAttribute('src', 'teste.jpg');
    });

    it('deve chamar addToCart quando o botão de adicionar for clicado', () => {
        const { addToCart } = useCartStore();

        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Adicionar'));
        expect(addToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('deve chamar toggleFavorite quando o botão de favorito for clicado', () => {
        const { toggleFavorite } = useFavoritesStore();

        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /favorito/i }));
        expect(toggleFavorite).toHaveBeenCalledWith(mockProduct);
    });

    it('deve mostrar o coração preenchido quando o produto estiver nos favoritos', () => {
        useFavoritesStore.mockReturnValue({
            favorites: [mockProduct],
            toggleFavorite: jest.fn()
        });

        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        const heartIcon = screen.getByRole('button', { name: /favorito/i }).querySelector('svg');
        expect(heartIcon).toHaveClass('text-red-500');
    });
}); 