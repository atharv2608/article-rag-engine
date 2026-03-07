import { retrieveRelevantChunks } from "../services/retrievalService.js";
import { generateAnswer } from "../services/generationService.js";

export const chat = async (req, res) => {

    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const chunks = await retrieveRelevantChunks(question);

        const answer = await generateAnswer(question, chunks);

        res.json({
            answer,
            sources: chunks
        });

    } catch (error) {

        res.status(500).json({
            message: "Error generating response",
            error: error.message
        });

    }

};