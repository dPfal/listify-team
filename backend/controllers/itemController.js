const Item = require("../models/Item");

const createItem = async (req, res) => {
  const { name, quantity, category } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Item name is required",
      });
    }

    const item = await Item.create({
      name: name.trim(),
      quantity: quantity || 1,
      category: category || "Uncategorized",
      user: req.user.id,
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  const { name, quantity, category, purchased } = req.body;

  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    item.name = name ?? item.name;
    item.quantity = quantity ?? item.quantity;
    item.category = category ?? item.category;
    item.purchased = purchased ?? item.purchased;

    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
};
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};
const clearAllItems = async (req, res) => {
  try {
    await Item.deleteMany({ user: req.user.id });

    return res.status(200).json({
      message: "All items deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to clear items",
      error: error.message,
    });
  }
};
module.exports = {
  clearAllItems,
  createItem,
  updateItem,
  deleteItem,
  getItems,
};
