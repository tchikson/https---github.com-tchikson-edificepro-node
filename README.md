# ÉdificePro — Node.js

Application web de gestion de chantiers BTP développée avec **Node.js**, **Express.js** et **PostgreSQL**.

## Fonctionnalités

- **Gestion des utilisateurs** : CRUD complet, rôles (admin/utilisateur), compétences
- **Gestion des équipes** : Création, affectation de membres, chef d'équipe, contrôle des conflits de dates
- **Gestion des chantiers** : CRUD, statuts (en cours/en pause/terminé), compétences requises, affectation d'équipes
- **Gestion des compétences** : Référentiel de compétences, association aux utilisateurs et chantiers
- **Dashboard** : Vue Gantt des chantiers, filtres par statut et période
- **Sécurité** : Authentification Passport.js, CSRF, headers OWASP, RBAC, journalisation

## Stack technique

- **Backend** : Node.js 20, Express.js 4.21
- **ORM** : Sequelize 6.37
- **Base de données** : PostgreSQL 16
- **Templates** : EJS + express-ejs-layouts
- **Auth** : Passport.js (local strategy) + bcryptjs
- **Tests** : Jest 29 + supertest 7
- **CI/CD** : GitHub Actions
- **Docker** : Node.js 20 Alpine + Nginx 1.25 + PostgreSQL 16

## Démarrage rapide

### Avec Docker (recommandé)

```bash
# Cloner le projet
git clone <url-du-depot>
cd edificepro-node

# Démarrer
docker compose up -d

# Migrations + données de test
docker compose exec app npx sequelize-cli db:migrate
docker compose exec app npx sequelize-cli db:seed:all
```

Accéder à `http://localhost:8080`

**Compte admin** : `admin@edificepro.fr` / `admin123`

### En local

```bash
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

Accéder à `http://localhost:3000`

## Commandes utiles

```bash
make start          # Démarrer Docker
make stop           # Arrêter Docker
make migrate        # Lancer les migrations
make seed           # Lancer les seeders
make db-reset       # Reset complet de la base
make test           # Lancer les tests
make lint           # Vérifier le code
make shell          # Shell dans le conteneur
```

## Tests

```bash
# Lancer tous les tests
npm test

# Avec couverture
npm test -- --coverage
```

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Architecture technique détaillée
- [DEPLOIEMENT.md](DEPLOIEMENT.md) — Guide de déploiement
- [SAUVEGARDE.md](SAUVEGARDE.md) — Stratégie de sauvegarde et PRA
- [VEILLE_SECURITE.md](VEILLE_SECURITE.md) — Veille sécurité et OWASP

## Licence

Projet réalisé dans le cadre de la certification CDA (Concepteur Développeur d'Applications).
