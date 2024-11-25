const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // Vérifie si le token est présent
  if (!token) {
    return res.status(401).json({ error: "Not Authorized. Token is missing." });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si le token est valide, ajoute les informations de l'utilisateur à la requête
    req.user = decoded;
    console.log("Utilisateur authentifié:", req.user); // Affiche l'utilisateur dans les logs

    next(); // Passe à l'étape suivante du middleware
  } catch (error) {
    // Log de l'erreur pour une meilleure visibilité dans les logs du serveur
    console.error("Erreur lors de la vérification du token:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = { auth };
