require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration CORS pour Vercel
const allowedOrigin = process.env.CORS_ORIGIN || "https://cbtc-platform.vercel.app";
app.use(cors({ 
  origin: allowedOrigin, 
  credentials: true 
}));

app.use(express.json());

// Route de santé - Heartbeat de votre empire
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    message: "CBTC Backend API Excellence - Opérationnel",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Base de données temporaire (en attendant PostgreSQL)
const users = [
  {
    id: 1,
    email: "demo@cbtc.com",
    password: "$2a$10$rQ8K5O.rQxlKJ5s8wGx8eeF8B9F8qGx8wGx8wGx8wGx8wGx8wGx8w", // demo123
    name: "Utilisateur Demo CBTC",
    role: "student"
  }
];

// Route d'authentification - Porte d'entrée de l'excellence
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email et mot de passe requis" 
      });
    }

    // Recherche utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: "Identifiants invalides" 
      });
    }

    // Vérification mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: "Identifiants invalides" 
      });
    }

    // Génération token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || "cbtc_excellence_2024_abel_coulibaly_backend",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Connexion réussie - Bienvenue dans l excellence CBTC",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Erreur authentification:", error);
    res.status(500).json({ 
      error: "Erreur serveur interne" 
    });
  }
});

// Route de vérification token
app.get("/api/auth/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cbtc_excellence_2024_abel_coulibaly_backend");
    res.json({ 
      valid: true, 
      user: decoded,
      message: "Token valide - Session active"
    });
  } catch (error) {
    res.status(401).json({ 
      error: "Token invalide",
      valid: false 
    });
  }
});

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route non trouvée",
    availableRoutes: ["/health", "/api/auth/login", "/api/auth/verify"]
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ 
    error: "Erreur serveur interne",
    message: process.env.NODE_ENV === "development" ? err.message : "Une erreur est survenue"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CBTC Backend API Excellence démarrée sur le port ${PORT}`);
  console.log(`🌍 CORS configuré pour: ${allowedOrigin}`);
  console.log(`⚡ Environnement: ${process.env.NODE_ENV || "development"}`);
});
