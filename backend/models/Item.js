const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ADDED THIS: Now the item knows which specific list it belongs to - update the list (SeulaKoo)
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true, 
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
