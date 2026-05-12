const GroceryList = require("../models/GroceryList");
const Item = require("../models/Item");
const DashboardFacade = require("../services/DashboardFacade");

const createList = async (req, res) => {
  const { title } = req.body;

  try {
    const list = await GroceryList.create({
      title: title && title.trim() ? title.trim() : "My Grocery List",
      user: req.user.id,
    });

    return res.status(201).json(list);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create grocery list",
      error: error.message,
    });
  }
};

const getLists = async (req, res) => {
  try {
    const dashboardData = await DashboardFacade.getUserDashboard(req.user.id);
    return res.status(200).json(dashboardData);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch grocery lists",
      error: error.message,
    });
  }
};

const updateList = async (req, res) => {
  const { title } = req.body;

  try {
    const list = await GroceryList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: "Grocery list not found" });
    }

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (title && title.trim()) {
      list.title = title.trim();
    }

    const updatedList = await list.save();
    return res.status(200).json(updatedList);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update grocery list",
      error: error.message,
    });
  }
};

const deleteList = async (req, res) => {
  try {
    const list = await GroceryList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: "Grocery list not found" });
    }

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Item.deleteMany({ user: req.user.id, list: list._id });
    await list.deleteOne();

    return res.status(200).json({ message: "Grocery list deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete grocery list",
      error: error.message,
    });
  }
};

module.exports = {
  createList,
  getLists,
  updateList,
  deleteList,
};
