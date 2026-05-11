const express = require("express");
const router = express.Router();

const {
  getListName,
  updateListName,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/list-name", protect, getListName);
router.put("/list-name", protect, updateListName);
router.put("/profile", protect, updateProfile);

module.exports = router;
