const List = require('../models/List');
const DashboardFacade = require('../services/DashboardFacade');

// @desc    Get user's dashboard (All lists + item counts)
// @route   GET /api/lists
const getDashboardLists = async (req, res) => {
  try {
    // Look how clean this is thanks to the Facade pattern!
    const dashboardData = await DashboardFacade.getUserDashboard(req.user._id);
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching dashboard' });
  }
};

// @desc    Create a new list
// @route   POST /api/lists
const createList = async (req, res) => {
  try {
    const list = await List.create({
      name: req.body.name,
      user: req.user._id
    });
    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ message: 'Could not create list' });
  }
};

module.exports = { getDashboardLists, createList };
