import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register, login } from "./controllers/authController.js";
import { authRequired } from "./middleware/authMiddleware.js";
import { createItem, getItems, getItemsByUser, getItemById, updateItem, deleteItem } from "./controllers/itemController.js";
import { connectDB } from "./services/db.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/items", authRequired, createItem);
app.get("/api/items", getItems);
app.get("/api/items/user/:userId", getItemsByUser);
app.get("/api/items/:id", getItemById);
app.put("/api/items/:id", authRequired, updateItem);
app.delete("/api/items/:id", authRequired, deleteItem);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";

connectDB(MONGO_URI);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

