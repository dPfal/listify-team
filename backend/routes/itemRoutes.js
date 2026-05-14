const express = require("express");
const router = express.Router();

const {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  clearAllItems,
  getItemSuggestions,
} = require("../controllers/itemController.js");

const { protect } = require("../middleware/authMiddleware");
const loggingMiddleware = require("../middleware/loggingMiddleware");
const { validateItemInput } = require("../middleware/validationMiddleware");

module.exports = router;
router.post("/", protect, loggingMiddleware,validateItemInput, createItem);
router.get("/", protect, loggingMiddleware, getItems);
router.get("/suggestions", protect, loggingMiddleware, getItemSuggestions);
router.put("/:id", protect, loggingMiddleware, validateItemInput, updateItem);
router.delete("/:id", protect, loggingMiddleware, deleteItem);
router.delete("/", protect, loggingMiddleware, clearAllItems);

module.exports = router;
