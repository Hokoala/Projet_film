describe('Authentification - Inscription', () => {
  beforeEach(() => {
    // Nettoyer le localStorage avant chaque test
    cy.clearLocalStorage()
    cy.visit('/register')
  })

  it('devrait afficher le formulaire d\'inscription', () => {
    cy.contains('Inscription').should('be.visible')
    cy.get('input[type="text"]').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length', 2)
  })

  it('devrait afficher un lien vers la connexion', () => {
    cy.contains('Vous avez déjà un compte').should('be.visible')
    cy.contains('Se connecter').should('be.visible')
  })

  it('devrait s\'inscrire avec succès', () => {
    const timestamp = Date.now()

    cy.get('input[placeholder*="nom"]').type(`Test User ${timestamp}`)
    cy.get('input[type="email"]').type(`test${timestamp}@example.com`)
    cy.get('input[type="password"]').first().type('password123')
    cy.get('input[type="password"]').last().type('password123')

    cy.contains('button', 'S\'inscrire').click()

    cy.contains('Inscription réussie').should('be.visible')
    cy.url().should('include', '/films', { timeout: 3000 })
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', () => {
    cy.get('input[placeholder*="nom"]').type('Test User')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').first().type('password123')
    cy.get('input[type="password"]').last().type('different')

    cy.contains('button', 'S\'inscrire').click()

    cy.contains('Les mots de passe ne correspondent pas').should('be.visible')
  })

  it('devrait afficher une erreur si l\'email existe déjà', () => {
    cy.get('input[placeholder*="nom"]').type('Admin')
    cy.get('input[type="email"]').type('admin@example.com')
    cy.get('input[type="password"]').first().type('123')
    cy.get('input[type="password"]').last().type('123')

    cy.contains('button', 'S\'inscrire').click()

    cy.contains('Cet email est déjà utilisé').should('be.visible')
  })

  it('devrait rediriger vers la connexion', () => {
    cy.contains('Se connecter').click()
    cy.url().should('include', '/login')
  })
})

describe('Authentification - Connexion', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('devrait afficher le formulaire de connexion', () => {
    cy.contains('Connexion').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('devrait se connecter avec succès (Admin)', () => {
    cy.get('input[type="email"]').clear().type('admin@example.com')
    cy.get('input[type="password"]').clear().type('123')

    cy.contains('button', 'Se connecter').click()

    cy.url().should('include', '/films')

    // Vérifier que l'utilisateur est connecté dans la navbar
    cy.get('nav').within(() => {
      cy.contains('Admin User').should('be.visible')
      cy.contains('admin').should('be.visible')
      cy.contains('Déconnexion').should('be.visible')
    })
  })

  it('devrait se connecter avec succès (Éditeur)', () => {
    cy.get('input[type="email"]').clear().type('jean@example.com')
    cy.get('input[type="password"]').clear().type('123')

    cy.contains('button', 'Se connecter').click()

    cy.url().should('include', '/films')
    cy.contains('Jean Martin').should('be.visible')
  })

  it('devrait afficher une erreur avec de mauvais identifiants', () => {
    cy.get('input[type="email"]').clear().type('wrong@example.com')
    cy.get('input[type="password"]').clear().type('wrongpassword')

    cy.contains('button', 'Se connecter').click()

    cy.contains('Email ou mot de passe incorrect').should('be.visible')
  })

  it('devrait rediriger vers l\'inscription', () => {
    cy.contains('S\'inscrire').click()
    cy.url().should('include', '/register')
  })

  it('devrait persister la connexion après rafraîchissement', () => {
    cy.get('input[type="email"]').clear().type('admin@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()

    cy.url().should('include', '/films')

    // Rafraîchir la page
    cy.reload()

    // L'utilisateur devrait toujours être connecté
    cy.contains('Admin User').should('be.visible')
  })
})

describe('Authentification - Déconnexion', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')

    // Se connecter d'abord
    cy.get('input[type="email"]').clear().type('admin@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()
    cy.url().should('include', '/films')
  })

  it('devrait se déconnecter avec succès', () => {
    cy.contains('Déconnexion').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Vérifier que les boutons de connexion sont de retour
    cy.get('nav').within(() => {
      cy.contains('button', 'Connexion').should('be.visible')
      cy.contains('button', 'Inscription').should('be.visible')
    })
  })

  it('devrait supprimer les données de session', () => {
    cy.contains('Déconnexion').click()

    // Vérifier que le localStorage est vide
    cy.window().then((win) => {
      expect(win.localStorage.getItem('currentUser')).to.be.null
    })
  })

  it('ne devrait plus avoir accès aux pages protégées après déconnexion', () => {
    // Se déconnecter
    cy.contains('Déconnexion').click()

    // Essayer d'accéder à l'admin
    cy.visit('/admin')

    // Devrait ne pas voir le contenu admin
    cy.get('nav').within(() => {
      cy.contains('Administration').should('not.exist')
    })
  })
})

describe('Authentification - Gestion des rôles', () => {
  it('devrait afficher le lien Administration pour l\'admin', () => {
    cy.clearLocalStorage()
    cy.visit('/login')

    cy.get('input[type="email"]').clear().type('admin@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()

    cy.get('nav').within(() => {
      cy.contains('Administration').should('be.visible')
    })
  })

  it('ne devrait pas afficher le lien Administration pour l\'éditeur', () => {
    cy.clearLocalStorage()
    cy.visit('/login')

    cy.get('input[type="email"]').clear().type('jean@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()

    cy.get('nav').within(() => {
      cy.contains('Administration').should('not.exist')
    })
  })

  it('ne devrait pas afficher le lien Administration pour l\'auteur', () => {
    cy.clearLocalStorage()
    cy.visit('/login')

    cy.get('input[type="email"]').clear().type('marie@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()

    cy.get('nav').within(() => {
      cy.contains('Administration').should('not.exist')
    })
  })

  it('devrait afficher le rôle de l\'utilisateur connecté', () => {
    cy.clearLocalStorage()
    cy.visit('/login')

    cy.get('input[type="email"]').clear().type('admin@example.com')
    cy.get('input[type="password"]').clear().type('123')
    cy.contains('button', 'Se connecter').click()

    cy.get('nav').contains('admin').should('be.visible')
  })
})

describe('Authentification - Mot de passe oublié', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('devrait afficher le lien "Mot de passe oublié ?"', () => {
    cy.contains('Mot de passe oublié ?').should('be.visible')
  })

  it('devrait ouvrir le modal au clic sur le lien', () => {
    cy.contains('Mot de passe oublié ?').click()

    // Vérifier que le modal est ouvert
    cy.contains('h3', 'Mot de passe oublié').should('be.visible')
    cy.contains('Entrez votre adresse email').should('be.visible')
    cy.get('input[type="email"]').should('have.length', 2) // Un dans le form login, un dans le modal
  })

  it('devrait fermer le modal au clic sur Annuler', () => {
    cy.contains('Mot de passe oublié ?').click()
    cy.contains('h3', 'Mot de passe oublié').should('be.visible')

    cy.contains('button', 'Annuler').click()

    // Le modal devrait être fermé
    cy.contains('h3', 'Mot de passe oublié').should('not.exist')
  })

  it('devrait afficher le champ email dans le modal', () => {
    cy.contains('Mot de passe oublié ?').click()

    // Vérifier la présence du formulaire
    cy.get('form').within(() => {
      cy.get('input[type="email"][placeholder="votre@email.com"]').should('be.visible')
      cy.contains('button', 'Envoyer le lien').should('be.visible')
    })
  })

  it('devrait soumettre le formulaire avec un email valide', () => {
    // Intercepter la requête API
    cy.intercept('POST', '**/forgot-password', {
      statusCode: 200,
      body: { message: 'Un email de réinitialisation a été envoyé.' }
    }).as('forgotPassword')

    cy.contains('Mot de passe oublié ?').click()

    // Remplir l'email dans le modal (le 2ème champ email)
    cy.get('input[placeholder="votre@email.com"]').last().type('test@example.com')
    cy.contains('button', 'Envoyer le lien').click()

    // Vérifier que la requête a été envoyée
    cy.wait('@forgotPassword')

    // Vérifier le message de succès
    cy.contains('Un email de réinitialisation a été envoyé').should('be.visible')
  })

  it('devrait afficher une erreur si l\'email n\'existe pas', () => {
    // Intercepter la requête API avec une erreur
    cy.intercept('POST', '**/forgot-password', {
      statusCode: 404,
      body: { error: 'Aucun compte associé à cet email.' }
    }).as('forgotPasswordError')

    cy.contains('Mot de passe oublié ?').click()

    cy.get('input[placeholder="votre@email.com"]').last().type('inexistant@example.com')
    cy.contains('button', 'Envoyer le lien').click()

    cy.wait('@forgotPasswordError')

    // Vérifier le message d'erreur
    cy.contains('Aucun compte associé à cet email').should('be.visible')
  })

  it('devrait vider le champ email après succès', () => {
    cy.intercept('POST', '**/forgot-password', {
      statusCode: 200,
      body: { message: 'Email envoyé avec succès.' }
    }).as('forgotPassword')

    cy.contains('Mot de passe oublié ?').click()

    cy.get('input[placeholder="votre@email.com"]').last().type('test@example.com')
    cy.contains('button', 'Envoyer le lien').click()

    cy.wait('@forgotPassword')

    // Le champ email devrait être vide
    cy.get('input[placeholder="votre@email.com"]').last().should('have.value', '')
  })

  it('devrait afficher un loader pendant l\'envoi', () => {
    cy.intercept('POST', '**/forgot-password', {
      delay: 1000,
      statusCode: 200,
      body: { message: 'Email envoyé.' }
    }).as('forgotPasswordSlow')

    cy.contains('Mot de passe oublié ?').click()

    cy.get('input[placeholder="votre@email.com"]').last().type('test@example.com')
    cy.contains('button', 'Envoyer le lien').click()

    // Le bouton devrait être en état de chargement
    cy.get('button').contains('Envoyer le lien').parent().should('have.attr', 'data-loading', 'true')
  })
})

