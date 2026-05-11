class ItemFactory {
  static createItem(itemData, userId) {
    const { name, quantity, category, list } = itemData;

    return {
      name: name.trim(),
      quantity: quantity || 1,
      category: category || "Uncategorized",
      user: userId,
      list,
    };
  }
}

module.exports = ItemFactory;