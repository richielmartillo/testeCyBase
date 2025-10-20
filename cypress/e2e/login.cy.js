/// <reference types="cypress" />

describe('Login no hub de leitura', () => {

  beforeEach(() => {
    cy.visit('login.html')
  });

  it('Deve fazer login com sucesso com usuário comum', () => {
    cy.login('usuario@teste.com', 'user123')
    cy.get('h4').should('contain', 'Olá')

  })

  it('Deve fazer login com sucesso com usuário admin', () => {
    cy.login('admin@biblioteca.com', 'admin123')
    cy.get('h1').should('contain', 'Painel Administrativo')
  })
})