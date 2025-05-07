import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
    it('deve renderizar o footer corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/loja esportiva/i)).toBeInTheDocument();
        expect(screen.getByText(/todos os direitos reservados/i)).toBeInTheDocument();
    });

    it('deve mostrar os links de navegação corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/sobre nós/i)).toBeInTheDocument();
        expect(screen.getByText(/contato/i)).toBeInTheDocument();
        expect(screen.getByText(/termos de uso/i)).toBeInTheDocument();
        expect(screen.getByText(/política de privacidade/i)).toBeInTheDocument();
    });

    it('deve mostrar os links de redes sociais corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/facebook/i)).toBeInTheDocument();
        expect(screen.getByText(/instagram/i)).toBeInTheDocument();
        expect(screen.getByText(/twitter/i)).toBeInTheDocument();
    });

    it('deve mostrar o ano atual no copyright', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    it('deve mostrar o endereço e contato corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/rua exemplo, 123/i)).toBeInTheDocument();
        expect(screen.getByText(/são paulo - sp/i)).toBeInTheDocument();
        expect(screen.getByText(/contato@lojaesportiva.com/i)).toBeInTheDocument();
        expect(screen.getByText(/\(11\) 9999-9999/i)).toBeInTheDocument();
    });

    it('deve mostrar os links de pagamento corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/cartões de crédito/i)).toBeInTheDocument();
        expect(screen.getByText(/boleto/i)).toBeInTheDocument();
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
    });

    it('deve mostrar os links de entrega corretamente', () => {
        render(<Footer />);

        expect(screen.getByText(/correios/i)).toBeInTheDocument();
        expect(screen.getByText(/transportadora/i)).toBeInTheDocument();
    });
}); 