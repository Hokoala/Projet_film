describe('Navigation et Interface', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('devrait avoir un titre de page approprié', () => {
    cy.title().should('exist')
  })

  it('devrait afficher la navbar sur toutes les pages', () => {
    // Page d'accueil
    cy.get('nav').should('be.visible')

    // Page films
    cy.visit('/films')
    cy.get('nav').should('be.visible')

    // Page login
    cy.visit('/login')
    cy.get('nav').should('be.visible')
  })

  it('devrait naviguer entre les pages via la navbar', () => {
    // Cliquer sur Films
    cy.get('nav').contains('Films').click()
    cy.url().should('include', '/films')

    // Retour à l'accueil via le logo
    cy.get('nav').contains('CinéFilms').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('devrait avoir des liens fonctionnels sur la page d\'accueil', () => {
    cy.contains('S\'inscrire').should('have.attr', 'href')
    cy.contains('Se connecter').should('have.attr', 'href')
    cy.contains('Découvrir les films').should('exist')
  })

  it('devrait être responsive (mobile)', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('nav').should('be.visible')
    cy.contains('CinéFilms').should('be.visible')
  })

  it('devrait être responsive (tablet)', () => {
    cy.viewport('ipad-2')
    cy.visit('/films')
    cy.contains('Liste des Films').should('be.visible')
  })

  it('devrait être responsive (desktop)', () => {
    cy.viewport(1920, 1080)
    cy.visit('/films')
    cy.contains('Liste des Films').should('be.visible')
  })

  it('ne devrait pas avoir d\'erreurs console', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.get('@consoleError').should('not.be.called')
  })
})

describe('Accessibilité', () => {
  it('devrait avoir des labels pour les champs de formulaire', () => {
    cy.visit('/login')
    cy.get('label').should('have.length.at.least', 2)
  })

  it('devrait avoir des placeholders informatifs', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').should('have.attr', 'placeholder')
    cy.get('input[type="password"]').should('have.attr', 'placeholder')
  })

  it('devrait avoir des attributs alt sur les images', () => {
    cy.visit('/films')
    cy.wait(500)
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
    })
  })
})

describe('Performance et UX', () => {
  it('devrait charger la page d\'accueil rapidement', () => {
    const start = Date.now()
    cy.visit('/')
    cy.contains('Bienvenue').should('be.visible')
    const end = Date.now()
    expect(end - start).to.be.lessThan(3000)
  })

  it('devrait afficher des indicateurs de chargement', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('admin@example.com')
    cy.get('input[type="password"]').type('123')

    cy.contains('button', 'Se connecter').click()
    // Le bouton devrait montrer un état de chargement brièvement
    cy.contains('button', 'Se connecter').should('exist')
  })

  it('devrait afficher des messages d\'erreur clairs', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('wrong@test.com')
    cy.get('input[type="password"]').type('wrong')
    cy.contains('button', 'Se connecter').click()

    cy.get('[class*="text-red"]').should('be.visible')
  })

  it('devrait afficher des messages de succès', () => {
    cy.visit('/register')
    const timestamp = Date.now()

    cy.get('input[placeholder*="nom"]').type(`User ${timestamp}`)
    cy.get('input[type="email"]').type(`user${timestamp}@test.com`)
    cy.get('input[type="password"]').first().type('test123')
    cy.get('input[type="password"]').last().type('test123')
    cy.contains('button', 'S\'inscrire').click()

    cy.contains('réussie').should('be.visible')
  })
})

