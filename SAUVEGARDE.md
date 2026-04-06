# Stratégie de Sauvegarde — ÉdificePro Node.js

## Objectif

Assurer la continuité de service et la récupération des données en cas d'incident (panne matérielle, erreur humaine, cyberattaque).

## Données à sauvegarder

| Donnée                    | Méthode              | Fréquence             | Rétention  |
| ------------------------- | -------------------- | --------------------- | ---------- |
| Base PostgreSQL           | pg_dump              | Quotidienne           | 30 jours   |
| Code source               | Git (dépôt distant)  | À chaque push         | Illimitée  |
| Variables d'environnement | Copie chiffrée       | À chaque modification | 3 versions |
| Logs applicatifs          | Rotation + archivage | Quotidienne           | 90 jours   |

## Sauvegarde PostgreSQL

### Script de sauvegarde automatique

Créer le fichier `scripts/backup.sh` :

```bash
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER="edificepro-node-database-1"
DB_NAME="app"
DB_USER="app"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# Dump compressé
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/backup_${DATE}.sql.gz"

# Suppression des sauvegardes anciennes
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Sauvegarde terminée : backup_${DATE}.sql.gz"
```

### Planification (crontab)

```cron
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /opt/edificepro/scripts/backup.sh >> /var/log/edificepro-backup.log 2>&1
```

## Restauration

### Restaurer depuis un dump

```bash
# Décompresser
gunzip backup_20250101_020000.sql.gz

# Restaurer
cat backup_20250101_020000.sql | docker exec -i edificepro-node-database-1 psql -U app -d app
```

### Restaurer dans un environnement propre

```bash
# Recréer la base
docker exec edificepro-node-database-1 psql -U app -c "DROP DATABASE IF EXISTS app;"
docker exec edificepro-node-database-1 psql -U app -c "CREATE DATABASE app;"

# Restaurer le dump
cat backup.sql | docker exec -i edificepro-node-database-1 psql -U app -d app
```

## Tests de restauration

Effectuer un test de restauration **mensuel** :

1. Créer un conteneur PostgreSQL temporaire
2. Restaurer le dernier backup
3. Vérifier l'intégrité des données (nombre d'enregistrements, cohérence)
4. Documenter le résultat

## Plan de Reprise d'Activité (PRA)

| Scénario              | RTO | RPO | Action                                       |
| --------------------- | --- | --- | -------------------------------------------- |
| Panne serveur         | 1h  | 24h | Redéploiement Docker + restauration backup   |
| Corruption de données | 2h  | 24h | Restauration du dernier backup sain          |
| Perte complète        | 4h  | 24h | Nouveau serveur + déploiement + restauration |

- **RTO** (Recovery Time Objective) : Temps maximal d'interruption acceptable
- **RPO** (Recovery Point Objective) : Perte de données maximale acceptable
