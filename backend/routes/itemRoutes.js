const express = require("express");
const router = express.Router();

const {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  clearAllItems,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const loggingMiddleware = require("../middleware/loggingMiddleware");
const { validateItemInput } = require("../middleware/validationMiddleware");

router.post("/", protect, loggingMiddleware,validateItemInput, createItem);
router.put("/:id", protect, loggingMiddleware,validateItemInput, updateItem);
router.delete("/:id", protect, loggingMiddleware, deleteItem);
router.get("/", protect, loggingMiddleware, getItems);
router.delete("/", protect, loggingMiddleware, clearAllItems);
module.exports = router;
