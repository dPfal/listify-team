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

// Manage individual items (creating, updating, deleting one by one)
router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

// UPDATED: These routes now require a listId so they know WHICH folder to look inside!
router.get("/:listId", protect, getItems);
router.delete("/clear/:listId", protect, clearAllItems); 

module.exports = router;
