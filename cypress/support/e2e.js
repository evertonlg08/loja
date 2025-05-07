// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais do Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o Cypress falhe o teste
    return false;
});

// Comando personalizado para login
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="submit-login"]').click();
});

// Comando personalizado para adicionar produto ao carrinho
Cypress.Commands.add('addToCart', (productIndex = 0) => {
    cy.get('[data-testid="product-card"]').eq(productIndex).click();
    cy.get('[data-testid="add-to-cart"]').click();
});

// Comando personalizado para verificar se está logado
Cypress.Commands.add('isLoggedIn', () => {
    cy.get('[data-testid="user-name"]').should('be.visible');
});

// Comando personalizado para verificar se não está logado
Cypress.Commands.add('isNotLoggedIn', () => {
    cy.get('[data-testid="login-button"]').should('be.visible');
}); 