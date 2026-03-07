import { getCollection } from "../db/chroma.js";
import Article from "../models/article.js";
import { createEmbedding } from "../utils/createEmbedding.js";
import { chunkText } from "../utils/chunkText.js";

export const processArticle = async (articleId) => {
    try {
        const article = await Article.findById(articleId);
        if (!article) return;
        const chunks = chunkText(article.content);
        const collection = await getCollection();
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

    } catch (error) {
        console.log(error);
        await Article.findByIdAndUpdate(articleId, { status: "error" });
    }

}