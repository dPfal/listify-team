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

router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);
router.get("/", protect, getItems);
router.delete("/", protect, clearAllItems);
module.exports = router;
