# Architecture Technique — ÉdificePro Node.js

## Vue d'ensemble

ÉdificePro est une application web de gestion de chantiers BTP construite avec **Node.js / Express.js**, suivant une architecture **MVC** (Modèle-Vue-Contrôleur).

## Stack technique

| Couche              | Technologie                  | Version   |
| ------------------- | ---------------------------- | --------- |
| Runtime             | Node.js                      | 20 LTS    |
| Framework HTTP      | Express.js                   | 4.21      |
| ORM                 | Sequelize                    | 6.37      |
| Base de données     | PostgreSQL                   | 16        |
| Moteur de templates | EJS + express-ejs-layouts    | 3.1 / 2.5 |
| Authentification    | Passport.js + passport-local | 0.7 / 1.0 |
| Hachage             | bcryptjs                     | 2.4       |
| Logging             | Winston                      | 3.x       |
| Tests               | Jest 29 + supertest 7        | —         |
| Conteneurisation    | Docker + Docker Compose      | —         |
| Reverse proxy       | Nginx                        | 1.25      |
| CI/CD               | GitHub Actions               | —         |

## Structure du projet

```
EDIFICEPRO-NODE/
├── docker/                    # Configuration Docker
│   ├── node/Dockerfile        # Image Node.js 20 Alpine
│   └── nginx/default.conf     # Reverse proxy
├── migrations/                # Migrations Sequelize
├── public/                    # Assets statiques
│   └── css/app.css
├── src/
│   ├── app.js                 # Configuration Express
│   ├── server.js              # Point d'entrée
│   ├── config/
│   │   ├── database.js        # Config Sequelize (dev/test/prod)
│   │   ├── passport.js        # Stratégie d'authentification
│   │   └── logger.js          # Configuration Winston
│   ├── controllers/           # Contrôleurs (logique HTTP)
│   │   ├── adminController.js
│   │   ├── chantierController.js
│   │   ├── competenceController.js
│   │   ├── dashboardController.js
│   │   ├── equipeController.js
│   │   ├── legalController.js
│   │   ├── securityController.js
│   │   └── userController.js
│   ├── middleware/             # Middleware Express
│   │   ├── auth.js            # isAuthenticated, isAdmin
│   │   ├── csrf.js            # Protection CSRF custom
│   │   ├── securityHeaders.js # Headers OWASP
│   │   └── securityLogger.js  # Journalisation sécurité
│   ├── models/                # Modèles Sequelize (8 entités)
│   │   ├── index.js           # Auto-chargement + associations
│   │   ├── User.js
│   │   ├── Chantier.js
│   │   ├── Equipe.js
│   │   ├── Competence.js
│   │   ├── Affectation.js
│   │   ├── CompetenceChantier.js
│   │   ├── CompetenceUser.js
│   │   └── EquipeUser.js
│   ├── routes/                # Définitions des routes
│   │   ├── index.js           # Routeur principal
│   │   ├── admin.js
│   │   ├── chantier.js
│   │   ├── competence.js
│   │   ├── dashboard.js
│   │   ├── equipe.js
│   │   ├── legal.js
│   │   ├── security.js
│   │   └── user.js
│   ├── services/              # Logique métier
│   │   ├── chantierService.js
│   │   └── equipeService.js
│   └── seeders/               # Données de test
├── views/                     # Templates EJS
│   ├── layouts/base.ejs       # Layout principal
│   ├── admin/
│   ├── chantier/
│   ├── competence/
│   ├── dashboard/
│   ├── equipe/
│   ├── errors/
│   ├── legal/
│   ├── security/
│   └── user/
├── tests/                     # Tests automatisés
│   ├── setup.js
│   ├── unit/
│   └── security/
├── compose.yaml               # Docker Compose
├── Makefile                   # Commandes utilitaires
└── .github/workflows/ci.yml  # Pipeline CI/CD
```

## Diagramme d'architecture

```
 Client (Navigateur)
        │
        ▼
  ┌──────────┐
  │  Nginx   │  Port 8080 → reverse proxy
  │  (proxy) │
  └────┬─────┘
       │
       ▼
  ┌──────────────┐
  │  Express.js  │  Port 3000
  │              │
  │  Middleware   │  securityHeaders → session → passport → csrf → routes
  │  Pipeline    │
  │              │
  │  Routes →    │──→ Controllers →  Services (logique métier)
  │  EJS Views   │                       │
  └──────┬───────┘                       │
         │                               ▼
         │                    ┌─────────────────┐
         └───────────────────►│  PostgreSQL 16   │
              Sequelize ORM   │  (database)      │
                              └─────────────────┘
```

## Modèle de données (MCD)

```
User ──1:N──> CompetenceUser <──N:1── Competence
User ──1:N──> EquipeUser     <──N:1── Equipe
User ──1:N──> Equipe (chefEquipeId)

Equipe ──1:N──> Affectation <──N:1── Chantier
Chantier ──1:N──> CompetenceChantier <──N:1── Competence
```

## Sécurité

- **Authentification** : Passport.js avec stratégie locale (email/mot de passe)
- **Hachage** : bcryptjs avec 10 rounds de salage
- **CSRF** : Token unique par session (crypto.randomBytes), vérifié et supprimé après utilisation
- **Headers OWASP** : X-Content-Type-Options, X-Frame-Options, CSP, HSTS, Referrer-Policy, Permissions-Policy
- **Sessions** : express-session avec cookie httpOnly, sameSite: lax, secure en production
- **RBAC** : Rôles ROLE_USER et ROLE_ADMIN stockés en JSON, middleware isAdmin
- **Journalisation** : Winston avec fichiers dédiés (app.log, error.log, security.log)

## Conformité RGPD

- Page mentions légales accessible publiquement
- Documentation des données collectées et finalités
- Droit d'accès, rectification, suppression implémentés via l'interface
- Mots de passe hachés, sessions sécurisées, pas de cookies tiers
