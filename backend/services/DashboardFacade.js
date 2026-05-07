const List = require('../models/List');
const Item = require('../models/Item');

// DESIGN PATTERN 2: FACADE
// This class provides a simplified interface to a complex subsystem.
// It hides the complexity of querying multiple database collections (Lists and Items)
// and returns one clean, formatted data package for the frontend dashboard.
class DashboardFacade {
  async getUserDashboard(userId) {
    // 1. Find all lists belonging to this user
    const lists = await List.find({ user: userId }).sort({ createdAt: -1 });

    // 2. Loop through each list and count how many items are inside it
    const dashboardData = await Promise.all(lists.map(async (list) => {
      const itemCount = await Item.countDocuments({ list: list._id });
      
      // Combine the list data with the item count
      return {
        _id: list._id,
        name: list.name,
        createdAt: list.createdAt,
        itemCount: itemCount 
      };
    }));

    return dashboardData;
  }
}

module.exports = new DashboardFacade();
