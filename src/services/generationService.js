import genAI from "../utils/geminiClient.js";

export const generateAnswer = async (question, contextChunks) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const context = contextChunks.join("\n\n");

    const prompt = `
You are an AI assistant.

Answer ONLY using the context below.

Context:
${context}

Question:
${question}

If the answer is not in the context say:
"I cannot find this information in the articles."
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
};