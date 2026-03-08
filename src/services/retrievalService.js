import { getCollection } from "../db/chroma.js";
import { createEmbedding } from "../utils/createEmbedding.js";

export const retrieveRelevantChunks = async (question, topK = 3, minSimilarity = 0.7) => {
    const collection = await getCollection();
    const queryEmbedding = await createEmbedding(question);

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        include: ["documents", "distances"]
    });
    const threshold = 1 - minSimilarity;
    
    const filteredDocs = [];
    for (let i = 0; i < results.documents[0].length; i++) {
        if (results.distances[0][i] <= threshold) {
            filteredDocs.push(results.documents[0][i]);
        }
    }
    
    return filteredDocs;
};