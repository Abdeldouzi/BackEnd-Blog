const express = require("express");
const { auth } = require("../middleware/auth");
const Article = require("../models/Article");

const router = express.Router();

// GET /api/articles
// Récupère tous les articles, triés par date de création décroissante
// GET /api/articles
// Permet à tout le monde (authentifié ou non) de récupérer les articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author")
      .sort({ createdAt: -1 });
    console.log(articles);

    res.json(articles); // Renvoie les articles sans l'auteur peuplé
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    res.status(500).json({ message: "Error fetching articles", error });
  }
});

// POST /api/articles
// Crée un nouvel article. L'utilisateur doit être authentifié (via le middleware auth)
router.post("/", auth, async (req, res) => {
  console.log("Utilisateur authentifié: ", req.user); // Log l'utilisateur qui effectue la requête

  try {
    const { title, content, imageUrl } = req.body;

    // Crée un nouvel article avec les données du corps de la requête
    const article = new Article({
      title,
      content,
      imageUrl,
      author: req.user.userId, // L'ID de l'utilisateur est récupéré depuis req.user
    });

    await article.save(); // Sauvegarde l'article dans la base de données
    res.status(201).json(article); // Renvoie l'article créé
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error }); // Erreur de création de l'article
  }
});

// PUT /api/articles/:id
// Modifie un article spécifique. L'utilisateur doit être authentifié et être l'auteur de l'article
router.put("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id); // Recherche l'article à modifier

    if (!article) {
      return res.status(404).json({ message: "Article not found" }); // Si l'article n'existe pas
    }

    // Vérifie que l'utilisateur est l'auteur de l'article
    if (article.author.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this article" }); // Si l'utilisateur n'est pas l'auteur
    }

    // Mise à jour des champs de l'article
    const { title, content, imageUrl } = req.body;
    article.title = title || article.title; // Si le champ est vide, garde la valeur actuelle
    article.content = content || article.content;
    article.imageUrl = imageUrl || article.imageUrl;

    await article.save(); // Sauvegarde les modifications dans la base de données
    res.json(article); // Renvoie l'article modifié
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error }); // Erreur de mise à jour de l'article
  }
});

// DELETE /api/articles/:id
// Supprime un article spécifique. L'utilisateur doit être authentifié et être l'auteur de l'article
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id); // Recherche l'article à supprimer

    if (!article) {
      return res.status(404).json({ message: "Article not found" }); // Si l'article n'existe pas
    }

    // Vérifie que l'utilisateur est l'auteur de l'article
    if (article.author.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this article" }); // Si l'utilisateur n'est pas l'auteur
    }

    await article.deleteOne(); // Supprime l'article de la base de données
    res.json({ message: "Article deleted successfully" }); // Renvoie un message de succès
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error }); // Erreur de suppression de l'article
  }
});

module.exports = router;
