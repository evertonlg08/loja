describe('Fluxo de Autenticação', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve fazer login com sucesso', () => {
        // Clica no botão de login
        cy.get('[data-testid="login-button"]').click();

        // Preenche o formulário
        cy.get('[data-testid="email"]').type('teste@teste.com');
        cy.get('[data-testid="password"]').type('123456');

        // Submete o formulário
        cy.get('[data-testid="submit-login"]').click();

        // Verifica se foi redirecionado para a página inicial
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verifica se o nome do usuário está visível
        cy.get('[data-testid="user-name"]').should('be.visible');
    });

    it('deve mostrar erro com credenciais inválidas', () => {
        // Clica no botão de login
        cy.get('[data-testid="login-button"]').click();

        // Preenche o formulário com credenciais inválidas
        cy.get('[data-testid="email"]').type('invalido@teste.com');
        cy.get('[data-testid="password"]').type('senhaerrada');

        // Submete o formulário
        cy.get('[data-testid="submit-login"]').click();

        // Verifica mensagem de erro
        cy.get('[data-testid="error-message"]')
            .should('be.visible')
            .and('contain', 'Credenciais inválidas');
    });

    it('deve fazer logout com sucesso', () => {
        // Faz login primeiro
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="email"]').type('teste@teste.com');
        cy.get('[data-testid="password"]').type('123456');
        cy.get('[data-testid="submit-login"]').click();

        // Clica no botão de logout
        cy.get('[data-testid="logout-button"]').click();

        // Verifica se foi redirecionado para a página inicial
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verifica se o botão de login está visível
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('deve registrar novo usuário com sucesso', () => {
        // Clica no botão de registro
        cy.get('[data-testid="register-button"]').click();

        // Preenche o formulário
        cy.get('[data-testid="name"]').type('Novo Usuário');
        cy.get('[data-testid="email"]').type('novo@teste.com');
        cy.get('[data-testid="password"]').type('123456');
        cy.get('[data-testid="confirm-password"]').type('123456');

        // Submete o formulário
        cy.get('[data-testid="submit-register"]').click();

        // Verifica se foi redirecionado para a página inicial
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verifica se o nome do usuário está visível
        cy.get('[data-testid="user-name"]').should('be.visible');
    });
}); 