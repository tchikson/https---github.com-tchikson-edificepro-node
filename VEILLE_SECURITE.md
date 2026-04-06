# Veille Sécurité — ÉdificePro Node.js

## Référentiel OWASP Top 10 (2021)

### Mesures implémentées

| # | Risque OWASP | Mesure appliquée |
|---|-------------|------------------|
| A01 | Broken Access Control | Middleware `isAuthenticated` + `isAdmin`, RBAC (ROLE_USER/ROLE_ADMIN) |
| A02 | Cryptographic Failures | bcryptjs (10 rounds), sessions httpOnly/sameSite, HTTPS en prod |
| A03 | Injection | Sequelize ORM (requêtes paramétrées), express-validator, échappement EJS |
| A04 | Insecure Design | Séparation MVC, services métier isolés, validation côté serveur |
| A05 | Security Misconfiguration | Headers OWASP (CSP, X-Frame-Options, HSTS), pas de stack trace en prod |
| A06 | Vulnerable Components | npm audit, Dependabot, CI/CD avec vérification |
| A07 | Auth Failures | Passport.js, sessions expirables (2h), journalisation des connexions |
| A08 | Data Integrity Failures | Protection CSRF token unique, vérification côté serveur |
| A09 | Logging Failures | Winston (app.log, error.log, security.log), journalisation des événements sécurité |
| A10 | SSRF | Pas de requêtes sortantes dynamiques, CSP restrictive |

## Processus de veille

### Surveillance des dépendances

```bash
# Audit des vulnérabilités npm
npm audit

# Audit avec correction automatique
npm audit fix

# Rapport détaillé
npm audit --json
```

### Dependabot (GitHub)

Créer `.github/dependabot.yml` :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Veille manuelle

| Source | Fréquence | URL |
|--------|-----------|-----|
| Node.js Security | Hebdomadaire | https://nodejs.org/en/blog/vulnerability |
| npm Advisory | Hebdomadaire | https://github.com/advisories |
| OWASP | Mensuelle | https://owasp.org |
| CVE Database | Mensuelle | https://cve.mitre.org |
| Express.js | Mensuelle | https://expressjs.com/en/advanced/security-updates.html |

## Headers de sécurité

Headers configurés dans `src/middleware/securityHeaders.js` :

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains (production)
```

## Journalisation sécurité

Événements journalisés dans `logs/security.log` :

- Connexions réussies (email, IP, timestamp)
- Tentatives de connexion échouées (email, IP, timestamp)
- Déconnexions
- Accès refusés (403)

### Format des logs

```json
{
  "level": "info",
  "message": "Connexion réussie",
  "email": "admin@edificepro.fr",
  "ip": "192.168.1.1",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Plan d'action en cas d'incident

1. **Détection** : Analyse des logs security.log (tentatives répétées, IP suspectes)
2. **Confinement** : Blocage IP si nécessaire, désactivation du compte compromis
3. **Investigation** : Analyse des logs, identification de la faille
4. **Correction** : Patch de sécurité, mise à jour des dépendances
5. **Communication** : Notification aux utilisateurs si données personnelles impactées (RGPD, 72h)
6. **Post-mortem** : Documentation de l'incident, amélioration des mesures

## Bonnes pratiques développeur

- Ne jamais committer de secrets (`.env.local` dans `.gitignore`)
- Toujours valider les entrées utilisateur côté serveur
- Utiliser des requêtes paramétrées (Sequelize ORM)
- Mettre à jour les dépendances régulièrement (`npm audit`)
- Tester les protections (CSRF, auth) à chaque modification
- Revoir le code pour les injections avant chaque merge
