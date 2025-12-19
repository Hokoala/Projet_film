describe('Page d\'accueil', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('devrait afficher la page d\'accueil', () => {
    cy.contains('Bienvenue sur le Projet Film').should('be.visible')
  })

  it('devrait afficher la navbar avec le logo', () => {
    cy.get('nav').should('be.visible')
    cy.contains('CinéFilms').should('be.visible')
  })

  it('devrait afficher les boutons de connexion et inscription', () => {
    cy.contains('button', 'Connexion').should('be.visible')
    cy.contains('button', 'Inscription').should('be.visible')
  })

  it('devrait naviguer vers la page des films', () => {
    cy.contains('Découvrir les films').click()
    cy.url().should('include', '/films')
  })

  it('devrait naviguer vers la page de connexion', () => {
    cy.contains('button', 'Connexion').click()
    cy.url().should('include', '/login')
  })

  it('devrait naviguer vers la page d\'inscription', () => {
    cy.contains('button', 'Inscription').click()
    cy.url().should('include', '/register')
  })
})

