describe('Fluxo de Produtos', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve filtrar produtos por categoria', () => {
        // Clica em uma categoria
        cy.get('[data-testid="category-button"]').contains('Tênis').click();

        // Verifica se os produtos foram filtrados
        cy.get('[data-testid="product-card"]').each(($card) => {
            cy.wrap($card).find('[data-testid="product-category"]')
                .should('contain', 'Tênis');
        });
    });

    it('deve buscar produtos por nome', () => {
        // Digita na busca
        cy.get('[data-testid="search-input"]').type('Nike');

        // Verifica se os produtos foram filtrados
        cy.get('[data-testid="product-card"]').each(($card) => {
            cy.wrap($card).find('[data-testid="product-name"]')
                .should('contain', 'Nike');
        });
    });

    it('deve ordenar produtos por preço', () => {
        // Seleciona ordenação
        cy.get('[data-testid="sort-select"]').select('price-asc');

        // Verifica se os produtos estão ordenados
        let prices = [];
        cy.get('[data-testid="product-price"]').each(($price) => {
            prices.push(parseFloat($price.text().replace('R$ ', '').replace(',', '.')));
        }).then(() => {
            const sorted = [...prices].sort((a, b) => a - b);
            expect(prices).to.deep.equal(sorted);
        });
    });

    it('deve mostrar detalhes do produto', () => {
        // Clica em um produto
        cy.get('[data-testid="product-card"]').first().click();

        // Verifica se os detalhes estão visíveis
        cy.get('[data-testid="product-details"]').should('be.visible');
        cy.get('[data-testid="product-name"]').should('be.visible');
        cy.get('[data-testid="product-price"]').should('be.visible');
        cy.get('[data-testid="product-description"]').should('be.visible');
        cy.get('[data-testid="product-images"]').should('be.visible');
    });

    it('deve mostrar produtos relacionados', () => {
        // Clica em um produto
        cy.get('[data-testid="product-card"]').first().click();

        // Verifica se há produtos relacionados
        cy.get('[data-testid="related-products"]').should('be.visible');
        cy.get('[data-testid="related-product-card"]').should('have.length.at.least', 1);
    });
}); 