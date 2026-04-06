# Guide de Déploiement — ÉdificePro Node.js

## Prérequis

- Docker >= 24.0 et Docker Compose >= 2.20
- Git
- (Optionnel) Node.js 20 LTS pour le développement local

## Déploiement avec Docker (recommandé)

### 1. Cloner le dépôt

```bash
git clone <url-du-depot> edificepro-node
cd edificepro-node
```

### 2. Configurer l'environnement

```bash
cp .env .env.local
```

Modifier `.env.local` avec les valeurs de production :

```env
APP_ENV=production
APP_PORT=3000
DB_HOST=database
DB_PORT=5432
DB_NAME=edificepro
DB_USER=edificepro_user
DB_PASSWORD=<mot-de-passe-fort>
APP_SECRET=<secret-aleatoire-64-chars>
SESSION_SECRET=<autre-secret-aleatoire>
```

### 3. Construire et démarrer

```bash
docker compose build --no-cache
docker compose up -d
```

### 4. Lancer les migrations

```bash
docker compose exec app npx sequelize-cli db:migrate
```

### 5. (Optionnel) Peupler la base

```bash
docker compose exec app npx sequelize-cli db:seed:all
```

### 6. Vérifier

```bash
# Vérifier les conteneurs
docker compose ps

# Vérifier les logs
docker compose logs -f app

# Tester l'accès
curl -I http://localhost:8080/login
```

L'application est accessible sur `http://localhost:8080`.

## Déploiement local (développement)

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer PostgreSQL

Créer une base de données :

```sql
CREATE DATABASE app;
CREATE USER app WITH PASSWORD '!ChangeMe!';
GRANT ALL PRIVILEGES ON DATABASE app TO app;
```

### 3. Lancer les migrations et seeders

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Démarrer en mode développement

```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

## Commandes Makefile

```bash
make start        # Démarrer les conteneurs
make stop         # Arrêter les conteneurs
make restart      # Redémarrer
make logs         # Voir les logs
make migrate      # Lancer les migrations
make seed         # Lancer les seeders
make db-reset     # Réinitialiser la base
make test         # Lancer les tests
make lint         # Vérifier le code
make shell        # Shell dans le conteneur app
make db-shell     # Shell PostgreSQL
```

## Mise en production

### Checklist

- [ ] Variables d'environnement de production configurées
- [ ] `APP_ENV=production`
- [ ] Secret aléatoire fort pour `APP_SECRET` et `SESSION_SECRET`
- [ ] Mot de passe PostgreSQL fort
- [ ] HTTPS activé (via Nginx ou load balancer)
- [ ] Logs configurés pour la rotation
- [ ] Sauvegardes automatisées (voir SAUVEGARDE.md)
- [ ] Monitoring en place

### Nginx en production (HTTPS)

Ajouter dans la config Nginx :

```nginx
server {
    listen 443 ssl;
    server_name edificepro.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Mise à jour

```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
docker compose exec app npx sequelize-cli db:migrate
```
