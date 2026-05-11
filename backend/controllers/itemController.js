const Item = require("../models/Item");
const ItemFactory = require("../factories/itemFactory");

const createItem = async (req, res) => {
  const { name, quantity, category, list } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Item name is required",
      });
    }

    if (!list) {
      return res.status(400).json({
        message: "List ID is required",
      });
    }

    const itemData = ItemFactory.createItem(req.body, req.user.id);
    const item = await Item.create(itemData);

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
    const filter = { user: req.user.id };

    if (req.query.list) {
      filter.list = req.query.list;
    }

    const items = await Item.find(filter).sort({
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
const getItemSuggestions = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query || !query.trim()) {
      return res.status(200).json([]);
    }

    const filter = {
      user: req.user.id,
      name: {
        $regex: `^${query.trim()}`,
        $options: "i",
      },
    };

    if (req.query.list) {
      filter.list = req.query.list;
    }

    const suggestions = await Item.find(filter)
      .select("name")
      .limit(5);

    const uniqueNames = [...new Set(suggestions.map((item) => item.name))];

    return res.status(200).json(uniqueNames);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch item suggestions",
      error: error.message,
    });
  }
};
const clearAllItems = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.list) {
      filter.list = req.query.list;
    }

    await Item.deleteMany(filter);

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
  getItemSuggestions,
};
