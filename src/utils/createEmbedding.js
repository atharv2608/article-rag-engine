import genAI from "./geminiClient.js";

export const createEmbedding = async (text) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-embedding-001"
    });

    const result = await model.embedContent(text);

    return result.embedding.values;
};