// Comando personalizado para limpar o carrinho
Cypress.Commands.add('clearCart', () => {
    cy.visit('/carrinho');
    cy.get('[data-testid="remove-item"]').each(($button) => {
        cy.wrap($button).click();
    });
});

// Comando personalizado para verificar se o carrinho está vazio
Cypress.Commands.add('cartShouldBeEmpty', () => {
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
});

// Comando personalizado para verificar se o carrinho tem itens
Cypress.Commands.add('cartShouldHaveItems', (count) => {
    cy.get('[data-testid="cart-item"]').should('have.length', count);
});

// Comando personalizado para preencher formulário de checkout
Cypress.Commands.add('fillCheckoutForm', (userData) => {
    cy.get('[data-testid="fullName"]').type(userData.fullName);
    cy.get('[data-testid="email"]').type(userData.email);
    cy.get('[data-testid="phone"]').type(userData.phone);
    cy.get('[data-testid="address"]').type(userData.address);
    cy.get('[data-testid="city"]').type(userData.city);
    cy.get('[data-testid="state"]').type(userData.state);
    cy.get('[data-testid="zipCode"]').type(userData.zipCode);
});

// Comando personalizado para selecionar método de pagamento
Cypress.Commands.add('selectPaymentMethod', (method) => {
    cy.get(`[data-testid="payment-method-${method}"]`).check();
});

// Comando personalizado para finalizar pedido
Cypress.Commands.add('finishOrder', () => {
    cy.get('[data-testid="finish-order"]').click();
});

// Comando personalizado para verificar se o pedido foi criado
Cypress.Commands.add('orderShouldBeCreated', () => {
    cy.url().should('include', '/pedidos');
    cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
});

// Comando personalizado para verificar se está na página de pedidos
Cypress.Commands.add('shouldBeOnOrdersPage', () => {
    cy.url().should('include', '/pedidos');
    cy.get('[data-testid="orders-list"]').should('be.visible');
});

// Comando personalizado para verificar se está na página de checkout
Cypress.Commands.add('shouldBeOnCheckoutPage', () => {
    cy.url().should('include', '/checkout');
    cy.get('[data-testid="checkout-form"]').should('be.visible');
});

// Comando personalizado para verificar se está na página do carrinho
Cypress.Commands.add('shouldBeOnCartPage', () => {
    cy.url().should('include', '/carrinho');
    cy.get('[data-testid="cart-items"]').should('be.visible');
}); 