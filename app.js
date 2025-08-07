const express = require("express");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MySQL
const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "cnss_db"
});

// Mailer pour réinitialisation
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yannis.bourhil12@gmail.com",
    pass: "ezsrbezcljeszjyz"
  }
});

// Test serveur
app.get("/", (req, res) => {
  res.send("Serveur CNSS actif");
});

// Connexion 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Email introuvable" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    res.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        immatriculation: user.immatriculation,
        telephone: user.telephone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

// Inscription
app.post("/api/register", async (req, res) => {
  const { immatriculation, nom, prenom, email, telephone, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (immatriculation, nom, prenom, email, telephone, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?)",
      [immatriculation, nom, prenom, email, telephone, hashed]
    );
    res.json({ success: true, message: "Inscription réussie" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const field = err.message.includes("email") ? "Email déjà utilisé" : "Immatriculation déjà utilisée";
      return res.json({ success: false, error: field });
    }
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

// Réinitialisation du mot de passe (demande de lien)
app.post("/api/request-password-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Aucun utilisateur avec cet email" });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1h

    await db.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    const resetLink = `http://localhost:3001/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: "yannis.bourhil12@gmail.com",
      to: email,
      subject: "Réinitialisation du mot de passe CNSS",
      html: `
        <h3>Bonjour ${user.prenom || ""} ${user.nom || ""},</h3>
        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur ce lien pour définir un nouveau mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    });

    res.json({ success: true, message: "Lien envoyé à votre adresse email." });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation :", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

const path = require("path");

app.get("/reset-password.html", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "reset-password.html"));
});

app.post("/api/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Lien invalide ou expiré" });
    }

    const resetRequest = rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET mot_de_passe = ? WHERE id = ?",
      [hashedPassword, resetRequest.user_id]
    );

    await db.query("DELETE FROM password_resets WHERE id = ?", [resetRequest.id]);

    res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur reset-password:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
});

// Lancement serveur
app.listen(3001, () => {
  console.log("✅ Serveur sur http://localhost:3001");
});



