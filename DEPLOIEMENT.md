# 🚀 Guide de Déploiement sur Render

## Préparation effectuée ✅

Les fichiers suivants ont été créés/modifiés pour le déploiement :

- ✅ `package.json` (racine) - Scripts de build et démarrage
- ✅ `render.yaml` - Configuration Render
- ✅ `40bierges/src/config.js` - URL d'API dynamique
- ✅ Tous les fichiers frontend mis à jour pour utiliser l'URL dynamique

## 📋 Étapes de déploiement sur Render

### 1. Sur Render.com

1. Allez sur https://render.com
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur **"New +"** → **"Web Service"**
4. Connectez votre compte GitHub si ce n'est pas déjà fait

### 2. Sélection du dépôt

- Cherchez et sélectionnez : **`Baptisteserste/Groupe-2`**
- Render va détecter automatiquement le fichier `render.yaml`

### 3. Configuration (si render.yaml n'est pas détecté)

Si Render ne détecte pas automatiquement, remplissez manuellement :

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Variables d'environnement à créer :**
- `NODE_ENV` = `production`
- `ACCESS_TOKEN_SECRET` = *générer un secret aléatoire* (32 caractères minimum)
- `PORT` = `10000` (Render l'assigne automatiquement)

### 4. Déploiement

1. Cliquez sur **"Create Web Service"**
2. Attendez la fin du build (~5-10 minutes)
3. Votre site sera disponible à : `https://votre-app.onrender.com`

## 🔐 Authentification

Le site nécessite une connexion pour accéder aux fonctionnalités.
Les comptes sont définis dans `api/data.json` avec des mots de passe hashés (bcrypt).

**Note pour Red/Blue Team** : Trouvez les identifiants par vous-même ! 🕵️

## ⚙️ Architecture du déploiement

```
Render Web Service
├── Build du frontend React (40bierges/)
│   └── Génère les fichiers dans 40bierges/build/
├── Copie vers api/public/
└── Démarrage du backend Express (api/)
    └── Sert le frontend via express.static('public')
```

## 🌐 URLs de production

- Frontend : `https://votre-app.onrender.com`
- API : `https://votre-app.onrender.com` (même origine)

## 📝 Notes importantes

⚠️ **Render Free Tier** :
- Le service s'endort après 15 minutes d'inactivité
- Premier accès après sommeil : ~30 secondes de démarrage
- 750h/mois gratuites

🔒 **Sécurité** :
- Changez le `ACCESS_TOKEN_SECRET` en production
- Ce site contient des vulnérabilités intentionnelles (projet Red/Blue Team)

## 🛠️ Dépannage

**Build échoue ?**
- Vérifiez les logs dans le dashboard Render
- Assurez-vous que le repo est public

**Site ne charge pas ?**
- Vérifiez que les variables d'environnement sont configurées
- Regardez les logs du serveur

**API ne répond pas ?**
- Le backend démarre sur le port fourni par Render (`process.env.PORT`)
- Vérifiez les logs pour les erreurs

## 🔄 Mises à jour

Render redéploie automatiquement lors de chaque push sur la branche `main` du dépôt GitHub.
