import "dotenv/config.js";
import express from "express";
import cors from "cors";
import articleRoutes from "./src/routes/article.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/chat", chatRoutes);

export default app;