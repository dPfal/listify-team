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

router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.get("/suggestions", protect, getItemSuggestions);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);
router.delete("/", protect, clearAllItems);


module.exports = router;
