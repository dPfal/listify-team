const express = require("express");
const router = express.Router();

const {
  getListName,
  updateListName,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/list-name", protect, getListName);
router.put("/list-name", protect, updateListName);

module.exports = router;
