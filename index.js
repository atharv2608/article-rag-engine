import app from "./app.js";
import connectToDb from "./src/db/connectToDb.js";
import { getCollection } from "./src/db/chroma.js";

const startServer = async () => {
    try {
        // Connect MongoDB
        await connectToDb();
        console.log("MongoDB connected");

        // Initialize Chroma collection
        await getCollection();
        console.log("Chroma vector DB ready");

        // Start server
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
};

startServer();