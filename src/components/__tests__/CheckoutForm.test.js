import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from '../CheckoutForm';

const mockOnSubmit = jest.fn();

describe('CheckoutForm', () => {
    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('deve renderizar o formulário corretamente', () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cartão de crédito/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/boleto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/pix/i)).toBeInTheDocument();
    });

    it('deve mostrar erros de validação quando o formulário for submetido vazio', async () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /finalizar pedido/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/telefone é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/endereço é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/cidade é obrigatória/i)).toBeInTheDocument();
            expect(screen.getByText(/estado é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/cep é obrigatório/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve chamar onSubmit com os dados corretos quando o formulário for válido', async () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        const formData = {
            fullName: 'João Silva',
            email: 'joao@teste.com',
            phone: '11999999999',
            address: 'Rua Teste, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            paymentMethod: 'credit',
        };

        fireEvent.change(screen.getByLabelText(/nome completo/i), {
            target: { value: formData.fullName },
        });
        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/telefone/i), {
            target: { value: formData.phone },
        });
        fireEvent.change(screen.getByLabelText(/endereço/i), {
            target: { value: formData.address },
        });
        fireEvent.change(screen.getByLabelText(/cidade/i), {
            target: { value: formData.city },
        });
        fireEvent.change(screen.getByLabelText(/estado/i), {
            target: { value: formData.state },
        });
        fireEvent.change(screen.getByLabelText(/cep/i), {
            target: { value: formData.zipCode },
        });
        fireEvent.click(screen.getByLabelText(/cartão de crédito/i));

        const submitButton = screen.getByRole('button', { name: /finalizar pedido/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(formData);
        });
    });

    it('deve validar o formato do e-mail', async () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: 'emailinvalido' },
        });

        const submitButton = screen.getByRole('button', { name: /finalizar pedido/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve validar o formato do telefone', async () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/telefone/i), {
            target: { value: '123' },
        });

        const submitButton = screen.getByRole('button', { name: /finalizar pedido/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/telefone inválido/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve validar o formato do CEP', async () => {
        render(<CheckoutForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/cep/i), {
            target: { value: '123' },
        });

        const submitButton = screen.getByRole('button', { name: /finalizar pedido/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/cep inválido/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
}); 