// backend/services/ItemSortStrategy.js
// DESIGN PATTERN: STRATEGY
// Defines a family of sorting algorithms and makes them interchangeable.
// The itemController can swap sorting strategies without changing its own logic.

class SortByName {
  sort(items) {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}

class SortByCategory {
  sort(items) {
    return items.sort((a, b) => a.category.localeCompare(b.category));
  }
}

class SortByDate {
  sort(items) {
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

class ItemSorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(items) {
    return this.strategy.sort(items);
  }
}

module.exports = { ItemSorter, SortByName, SortByCategory, SortByDate };
