import { getCollection } from "../db/chroma.js";
import { createEmbedding } from "../utils/createEmbedding.js";

export const retrieveRelevantChunks = async (question, topK = 3) => {

    const collection = await getCollection();

    const queryEmbedding = await createEmbedding(question);

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK
    });

    return results.documents[0];
};