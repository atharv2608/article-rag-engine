import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000
});

export const getCollection = async () => {
    return await client.getOrCreateCollection({
        name: "articles"
    });
};