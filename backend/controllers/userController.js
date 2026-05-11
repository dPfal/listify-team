const User = require("../models/User");

const getListName = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("listName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ listName: user.listName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateListName = async (req, res) => {
  try {
    const { listName } = req.body;

    if (!listName || !listName.trim()) {
      return res.status(400).json({ message: "List name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { listName: listName.trim() },
      { new: true, runValidators: true },
    ).select("listName");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "List name updated successfully",
      listName: updatedUser.listName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListName,
  updateListName,
};
