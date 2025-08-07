# Application CNSS – Projet ECF 2

Ce projet est une **application de gestion CNSS sécurisée**, développée dans le cadre de l'ECF 2 pour la formation "Concepteur Développeur d'Applications".

---

## Technos :

- 🔹 **Node.js + Express** (API REST sécurisée)
- 🔹 **MySQL** (Base de données relationnelle)
- 🔹 **Electron** (Interface de bureau)
- 🔹 **HTML / CSS / JS Vanilla**
- 🔹 **Nodemailer** (envoi de mail de réinitialisation)
- 🔹 **bcrypt** (hachage des mots de passe)
- 🔹 **crypto** (génération de tokens)
- 🔹 **CORS**, **dotenv**

---

## Fonctionnalités principales :

- Connexion / inscription utilisateur
- Hashage des mots de passe avec bcrypt
- Réinitialisation sécurisée du mot de passe par email
- Accès sécurisé au dashboard
- Tokens pour la réinitialisation
- Interface simple et claire

---

## Lancer le projet localement:

### 1. Cloner le dépôt

```bash
git clone https://github.com/yanDv042/ecf2-CNSS-1.git
cd ecf2-CNSS-1
```

### 2. Installer les dépendances :

```bash
npm install
```

### 3. Lancer le serveur :

```bash
node app.js
```

> Le serveur sera accessible à l'adresse : `http://localhost:3001`

---

## Config db :

Créer une base de données **`cnss_db`** avec les tables suivantes :

### Table `users`

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  immatriculation VARCHAR(255) UNIQUE,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  telephone VARCHAR(15),
  mot_de_passe TEXT
);
```

### Table `password_resets`

```sql
CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token TEXT,
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Exemple d'envoi de mail :

L'envoi d'email utilise un compte Gmail configuré dans `nodemailer` :

```js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "votre.email@gmail.com",
    pass: "motdepasse-application"
  }
});
```

⚠️ **Activer "Mot de passe d'application" dans Gmail** pour autoriser les envois.

---
