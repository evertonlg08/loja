describe('Fluxo de Pedidos', () => {
    beforeEach(() => {
        // Faz login antes de cada teste
        cy.visit('/');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="email"]').type('teste@teste.com');
        cy.get('[data-testid="password"]').type('123456');
        cy.get('[data-testid="submit-login"]').click();
    });

    it('deve listar pedidos do usuário', () => {
        // Vai para a página de pedidos
        cy.get('[data-testid="orders-button"]').click();

        // Verifica se a lista de pedidos está visível
        cy.get('[data-testid="orders-list"]').should('be.visible');
        cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
    });

    it('deve mostrar detalhes do pedido', () => {
        // Vai para a página de pedidos
        cy.get('[data-testid="orders-button"]').click();

        // Clica em um pedido
        cy.get('[data-testid="order-item"]').first().click();

        // Verifica se os detalhes estão visíveis
        cy.get('[data-testid="order-details"]').should('be.visible');
        cy.get('[data-testid="order-number"]').should('be.visible');
        cy.get('[data-testid="order-date"]').should('be.visible');
        cy.get('[data-testid="order-status"]').should('be.visible');
        cy.get('[data-testid="order-items"]').should('be.visible');
        cy.get('[data-testid="order-total"]').should('be.visible');
    });

    it('deve cancelar um pedido', () => {
        // Vai para a página de pedidos
        cy.get('[data-testid="orders-button"]').click();

        // Clica em um pedido
        cy.get('[data-testid="order-item"]').first().click();

        // Clica no botão de cancelar
        cy.get('[data-testid="cancel-order"]').click();

        // Confirma o cancelamento
        cy.get('[data-testid="confirm-cancel"]').click();

        // Verifica se o status foi atualizado
        cy.get('[data-testid="order-status"]').should('contain', 'Cancelado');
    });

    it('deve filtrar pedidos por status', () => {
        // Vai para a página de pedidos
        cy.get('[data-testid="orders-button"]').click();

        // Seleciona um status
        cy.get('[data-testid="status-filter"]').select('Entregue');

        // Verifica se os pedidos foram filtrados
        cy.get('[data-testid="order-item"]').each(($item) => {
            cy.wrap($item).find('[data-testid="order-status"]')
                .should('contain', 'Entregue');
        });
    });

    it('deve mostrar histórico de status do pedido', () => {
        // Vai para a página de pedidos
        cy.get('[data-testid="orders-button"]').click();

        // Clica em um pedido
        cy.get('[data-testid="order-item"]').first().click();

        // Verifica se o histórico está visível
        cy.get('[data-testid="status-history"]').should('be.visible');
        cy.get('[data-testid="status-item"]').should('have.length.at.least', 1);
    });
}); 