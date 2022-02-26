describe('Admin Page', function () {
  it('should create a new post', function () {
    cy.task('db:reset')
    cy.task('db:seed-admin')

    cy.login()
    cy.visit('/admin')

    cy.get('[data-test="new-post"]')
      .click()
      .click()

    // cy.get('[data-test="new-post"]')
    //   .should('have.attr','disabled')
    cy.url()
      .should('contain','/edit')

    cy.visit('/admin')
    cy.get('[data-test="post-link"]')
      .should('have.attr','href')

    cy.get('[data-test="post-link"]')
      .click()

    cy.url().should('contain','/edit')

    cy.wait(2000);

    cy.get('[test-data="title"]')
      .type('{selectAll}{backspace}Awesome Post')

    cy.get('[test-data="editor"]')
      .type('{selectAll}{backspace}Awesome Content')

    cy.get('[data-test="publish-modal-btn"]')
      .click()

    cy.wait(500);

    cy.get('[data-test="summary"]')
      .type('{selectAll}{backspace}Awesome Summary')


    cy.get('[data-test="submit-publish"]')
      .click()

    cy.get('[data-test="read-post"]')
      .then((el) => {
        const link = el.attr('href');
        cy.log('link:',link)
        cy.visit(link)
        return Promise.resolve();
      })

    cy.get('body')
      .should('contain','Awesome Summary')
      .should('contain','Awesome Post')
      .should('contain','Awesome Content')
  });
});
