describe('Fluxo do Carrinho', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve adicionar produto ao carrinho e finalizar compra', () => {
        // Adiciona produto ao carrinho
        cy.get('[data-testid="product-card"]').first().click();
        cy.get('[data-testid="add-to-cart"]').click();

        // Verifica se o produto foi adicionado
        cy.get('[data-testid="cart-count"]').should('have.text', '1');

        // Vai para o carrinho
        cy.get('[data-testid="cart-button"]').click();

        // Verifica se o produto está no carrinho
        cy.get('[data-testid="cart-item"]').should('have.length', 1);

        // Vai para o checkout
        cy.get('[data-testid="checkout-button"]').click();

        // Preenche o formulário
        cy.get('[data-testid="fullName"]').type('João Silva');
        cy.get('[data-testid="email"]').type('joao@teste.com');
        cy.get('[data-testid="phone"]').type('11999999999');
        cy.get('[data-testid="address"]').type('Rua Teste, 123');
        cy.get('[data-testid="city"]').type('São Paulo');
        cy.get('[data-testid="state"]').type('SP');
        cy.get('[data-testid="zipCode"]').type('01234-567');

        // Seleciona método de pagamento
        cy.get('[data-testid="payment-method-credit"]').check();

        // Finaliza a compra
        cy.get('[data-testid="finish-order"]').click();

        // Verifica se foi redirecionado para a página de pedidos
        cy.url().should('include', '/pedidos');

        // Verifica se o pedido foi criado
        cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
    });

    it('deve atualizar quantidade e remover item do carrinho', () => {
        // Adiciona produto ao carrinho
        cy.get('[data-testid="product-card"]').first().click();
        cy.get('[data-testid="add-to-cart"]').click();

        // Vai para o carrinho
        cy.get('[data-testid="cart-button"]').click();

        // Aumenta quantidade
        cy.get('[data-testid="increase-quantity"]').click();
        cy.get('[data-testid="item-quantity"]').should('have.text', '2');

        // Diminui quantidade
        cy.get('[data-testid="decrease-quantity"]').click();
        cy.get('[data-testid="item-quantity"]').should('have.text', '1');

        // Remove item
        cy.get('[data-testid="remove-item"]').click();
        cy.get('[data-testid="cart-item"]').should('not.exist');
        cy.get('[data-testid="empty-cart-message"]').should('be.visible');
    });

    it('deve mostrar mensagem de erro ao tentar finalizar compra sem itens', () => {
        // Vai para o checkout diretamente
        cy.visit('/checkout');

        // Tenta finalizar compra
        cy.get('[data-testid="finish-order"]').click();

        // Verifica mensagem de erro
        cy.get('[data-testid="error-message"]')
            .should('be.visible')
            .and('contain', 'Seu carrinho está vazio');
    });
}); 