describe('Authentication', () => {

  it('should login admin user', function () {
    cy.clearCookies();
    cy.task('db:seed-admin')
    cy.visit('/admin');

    cy.url().should('contain','/login')

    cy.get('#email')
      .type('admin@example.com');

    cy.get('#password')
      .type('password{enter}')

    cy.get('[data-test="submit"]')
      .should('have.attr','disabled')

    cy.url().should('contain','/admin')
  });
})
