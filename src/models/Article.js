import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        chunkCount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["processing", "ready", "error"],
            default: "processing"
        },

        source: {
            type: String,
            default: "manual"
        }
    },
    {
        timestamps: true
    }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;