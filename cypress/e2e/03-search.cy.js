describe('Recherche de films', () => {
  beforeEach(() => {
    cy.visit('/films')
  })

  it('devrait afficher le champ de recherche', () => {
    cy.get('input[placeholder*="Rechercher"]').should('be.visible')
  })

  it('devrait avoir le focus sur le champ de recherche au chargement', () => {
    cy.get('input[placeholder*="Rechercher"]').should('have.focus')
  })

  it('devrait filtrer les films par titre', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Titanic')

    // Devrait afficher Titanic
    cy.contains('Titanic').should('be.visible')

    // Ne devrait pas afficher les autres
    cy.contains('Blade Runner').should('not.exist')
    cy.contains('The Shining').should('not.exist')

    // Vérifier les stats
    cy.contains('1 film(s) trouvé(s) sur 3 total').should('be.visible')
  })

  it('devrait filtrer les films par réalisateur', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Kubrick')

    cy.contains('The Shining').should('be.visible')
    cy.contains('Titanic').should('not.exist')
    cy.contains('Blade Runner').should('not.exist')
  })

  it('devrait filtrer les films par acteur', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Harrison Ford')

    cy.contains('Blade Runner').should('be.visible')
    cy.contains('Titanic').should('not.exist')
    cy.contains('The Shining').should('not.exist')
  })

  it('devrait afficher le bouton Effacer pendant la recherche', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Titanic')
    cy.contains('button', 'Effacer').should('be.visible')
  })

  it('devrait effacer la recherche en cliquant sur Effacer', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Titanic')
    cy.contains('button', 'Effacer').click()

    // Tous les films devraient être visibles
    cy.contains('Titanic').should('be.visible')
    cy.contains('Blade Runner').should('be.visible')
    cy.contains('The Shining').should('be.visible')

    // Le champ devrait être vide
    cy.get('input[placeholder*="Rechercher"]').should('have.value', '')
  })

  it('devrait afficher un message si aucun résultat', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Film inexistant')

    cy.contains('Aucun film ne correspond à votre recherche').should('be.visible')
  })

  it('devrait rechercher en temps réel', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Jack')

    // Devrait trouver Titanic (Jack Dawson) et The Shining (Jack Nicholson)
    cy.contains('Titanic').should('be.visible')
    cy.contains('The Shining').should('be.visible')
    cy.contains('Blade Runner').should('not.exist')

    cy.contains('2 film(s) trouvé(s)').should('be.visible')
  })

  it('devrait afficher l\'horodatage de la dernière recherche', () => {
    cy.get('input[placeholder*="Rechercher"]').type('Titanic')

    cy.contains('dernière recherche:').should('be.visible')
  })
})

