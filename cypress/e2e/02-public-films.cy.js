describe('Partie publique - Films et Commentaires', () => {
  beforeEach(() => {
    cy.visit('/films')
  })

  it('devrait afficher la liste des films', () => {
    cy.contains('Liste des Films').should('be.visible')
    cy.get('[class*="grid"]').should('be.visible')
  })

  it('devrait afficher les 3 films (Titanic, Blade Runner, The Shining)', () => {
    cy.contains('Titanic').should('be.visible')
    cy.contains('Blade Runner').should('be.visible')
    cy.contains('The Shining').should('be.visible')
  })

  it('devrait afficher les informations de chaque film', () => {
    // Vérifier qu'on a les réalisateurs
    cy.contains('James Cameron').should('be.visible')
    cy.contains('Ridley Scott').should('be.visible')
    cy.contains('Stanley Kubrick').should('be.visible')
  })

  it('devrait afficher le nombre de commentaires', () => {
    cy.contains('3 commentaire(s)').should('be.visible')
    cy.contains('2 commentaire(s)').should('be.visible')
  })

  it('devrait permettre de cliquer sur "Voir détails" d\'un film', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })
    cy.url().should('include', '/films/')
  })

  it('devrait afficher les détails complets d\'un film', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })

    // Vérifier les détails
    cy.contains('Détails du film').should('be.visible')
    cy.contains('Synopsis').should('be.visible')
    cy.contains('Leonardo DiCaprio').should('be.visible')
  })

  it('devrait afficher tous les commentaires d\'un film', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })

    cy.contains('Commentaires').should('be.visible')
    cy.contains('Marie Dubois').should('be.visible')
    cy.contains('Jean Martin').should('be.visible')
  })

  it('devrait afficher le formulaire pour ajouter un commentaire', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })

    cy.contains('Ajouter un commentaire').should('be.visible')
    cy.get('input[placeholder*="nom"]').should('be.visible')
    cy.get('textarea[placeholder*="avis"]').should('be.visible')
  })

  it('devrait permettre d\'ajouter un commentaire public', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })

    // Remplir le formulaire
    cy.get('input[placeholder*="nom"]').type('Test Cypress')
    cy.get('textarea[placeholder*="avis"]').type('Excellent film testé par Cypress!')

    // Sélectionner une note (4 étoiles)
    cy.contains('button', '★').eq(3).click()

    // Soumettre
    cy.contains('button', 'Publier le commentaire').click()

    // Vérifier que le commentaire apparaît
    cy.contains('Test Cypress').should('be.visible')
    cy.contains('Excellent film testé par Cypress!').should('be.visible')
  })

  it('devrait permettre de retourner à la liste', () => {
    cy.contains('Titanic').parents('[class*="Card"]').within(() => {
      cy.contains('Voir détails').click()
    })

    cy.contains('Retour à la liste').click()
    cy.url().should('include', '/films')
    cy.url().should('not.include', '/films/')
  })
})

