import { getCollection } from "../db/chroma.js";
import Article from "../models/article.js";
import { processArticle } from "../services/processArticles.js";
import { chunkText } from "../utils/chunkText.js";
import { createEmbedding } from "../utils/createEmbedding.js";

export const addArticle = async (req, res) => {
    let newArticle;
    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }
        const existingTitle = await Article.findOne({ title });
        if (existingTitle) {
            return res.status(400).json({
                message: "Article with this title already exists"
            });
        }
        // 1️⃣ Save article with processing status
        newArticle = await Article.create({
            title,
            content,
            status: "processing"
        });
        res.status(201).json({
            message: "Article saved. Processing started"
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
            error: error.message
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

        const collection = await getCollection();

        // Delete old embeddings
        await collection.delete({
            where: { articleId: id }
        });

        const chunks = chunkText(article.content);

        for (let i = 0; i < chunks.length; i++) {

            const embedding = await createEmbedding(chunks[i]);

            await collection.add({
                ids: [`${article._id}_chunk_${i}`],
                documents: [chunks[i]],
                embeddings: [embedding],
                metadatas: [{
                    articleId: article._id.toString(),
                    chunkIndex: i
                }]
            });

        }

        article.status = "ready";
        article.chunkCount = chunks.length;

        await article.save();

        res.json(article);

    } catch (error) {

        res.status(500).json({
            message: "Error editing article",
            error: error.message
        });

    }
};