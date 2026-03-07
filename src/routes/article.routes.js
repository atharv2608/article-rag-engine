import express from "express";
import { addArticle, editArticle } from "../controllers/article.controller.js";

const router = express.Router();

router.post("/", addArticle);
router.put("/:id", editArticle);

export default router;
