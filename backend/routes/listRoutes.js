const express = require('express');
const router = express.Router();
const { getDashboardLists, createList } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

// Protect all list routes so only logged-in users can use them
router.route('/').get(protect, getDashboardLists).post(protect, createList);

module.exports = router;
