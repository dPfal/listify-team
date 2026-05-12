// backend/services/DashboardFacade.js
// DESIGN PATTERN: FACADE
// Provides a simplified interface to a complex subsystem.
// Hides the complexity of querying multiple collections (GroceryList + Items)
// and returns one clean data package for the frontend dashboard.

const GroceryList = require('../models/GroceryList');
const Item = require('../models/Item');

class DashboardFacade {
  async getUserDashboard(userId) {
    try {
      // 1. Find all lists belonging to this user
      const lists = await GroceryList.find({ user: userId }).sort({ createdAt: -1 });

      // 2. For each list, count how many items are inside it
      const dashboardData = await Promise.all(lists.map(async (list) => {
        const itemCount = await Item.countDocuments({ list: list._id });

        return {
          _id: list._id,
          title: list.title,
          createdAt: list.createdAt,
          itemCount,
        };
      }));

      return dashboardData;
    } catch (error) {
      throw new Error(`Dashboard fetch failed: ${error.message}`);
    }
  }
}

module.exports = new DashboardFacade();
