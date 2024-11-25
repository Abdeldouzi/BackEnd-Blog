const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // référence à un utilisateur
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt
  }
);

module.exports = mongoose.model("Article", articleSchema);
