import Article from "../models/Article.js";
import { processArticle } from "../services/processArticles.js";

export const addArticle = async (req, res) => {
  let newArticle;
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }
    const existingTitle = await Article.findOne({ title });
    if (existingTitle) {
      return res.status(400).json({
        message: "Article with this title already exists",
      });
    }
    // 1️⃣ Save article with processing status
    newArticle = await Article.create({
      title,
      content,
      status: "processing",
    });
    res.status(201).json({
      message: "Article saved. Processing started",
    });

    processArticle(newArticle._id);
  } catch (error) {
    console.error(error);
    if (newArticle) {
      newArticle.status = "error";
      await newArticle.save();
    }
    res.status(500).json({
      message: "Error adding article",
      error: error.message,
    });
  }
};

export const editArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.status = "processing";

    await article.save();
    res.status(200).json({ message: "Article updated. Processing started" });
    processArticle(article._id);
  } catch (error) {
    res.status(500).json({
      message: "Error editing article",
      error: error.message,
    });
  }
};
