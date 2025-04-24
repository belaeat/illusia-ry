import express from "express";
import {
  getItems,
  getFeaturedItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller";

const router = express.Router();

router.get("/", getItems);
router.get("/featured", getFeaturedItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
