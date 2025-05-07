import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '../AuthForm';

const mockOnSubmit = jest.fn();

describe('AuthForm', () => {
    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('deve renderizar o formulário de login corretamente', () => {
        render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve renderizar o formulário de registro corretamente', () => {
        render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
    });

    it('deve mostrar erros de validação quando o formulário de login for submetido vazio', async () => {
        render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve mostrar erros de validação quando o formulário de registro for submetido vazio', async () => {
        render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /registrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
            expect(screen.getByText(/confirmação de senha é obrigatória/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve chamar onSubmit com os dados corretos quando o formulário de login for válido', async () => {
        render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

        const formData = {
            email: 'teste@teste.com',
            password: '123456',
        };

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: formData.password },
        });

        const submitButton = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(formData);
        });
    });

    it('deve chamar onSubmit com os dados corretos quando o formulário de registro for válido', async () => {
        render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

        const formData = {
            name: 'Novo Usuário',
            email: 'novo@teste.com',
            password: '123456',
            confirmPassword: '123456',
        };

        fireEvent.change(screen.getByLabelText(/nome/i), {
            target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: formData.password },
        });
        fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
            target: { value: formData.confirmPassword },
        });

        const submitButton = screen.getByRole('button', { name: /registrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(formData);
        });
    });

    it('deve validar o formato do e-mail', async () => {
        render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: 'emailinvalido' },
        });

        const submitButton = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve validar se as senhas coincidem no registro', async () => {
        render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: '123456' },
        });
        fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
            target: { value: '654321' },
        });

        const submitButton = screen.getByRole('button', { name: /registrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve validar o tamanho mínimo da senha', async () => {
        render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: '123' },
        });

        const submitButton = screen.getByRole('button', { name: /registrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/a senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
}); 