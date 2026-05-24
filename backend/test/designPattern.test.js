const chai = require("chai");
const sinon = require("sinon");

const ItemFactory = require("../factories/itemFactory");
const { DatabaseConnection } = require("../config/db");
const { validateItemInput } = require("../middleware/validationMiddleware");
const DashboardFacade = require("../services/DashboardFacade");
const GroceryList = require("../models/GroceryList");
const Item = require("../models/Item");
const {
  SortByName,
  SortByCategory,
  SortByDate,
  ItemSorter,
} = require("../services/ItemSortStrategy");

const { expect } = chai;

describe("Design Pattern Functional Test", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Factory Pattern - ItemFactory", () => {
    it("should create item data with provided values", () => {
      const itemData = {
        name: " Milk ",
        quantity: 2,
        category: "Dairy",
        list: "list123",
      };

      const userId = "user123";

      const result = ItemFactory.createItem(itemData, userId);

      expect(result.name).to.equal("Milk");
      expect(result.quantity).to.equal(2);
      expect(result.category).to.equal("Dairy");
      expect(result.user).to.equal(userId);
      expect(result.list).to.equal("list123");
    });

    it("should apply default quantity and category when not provided", () => {
      const itemData = {
        name: "Bread",
        list: "list123",
      };

      const userId = "user123";

      const result = ItemFactory.createItem(itemData, userId);

      expect(result.name).to.equal("Bread");
      expect(result.quantity).to.equal(1);
      expect(result.category).to.equal("Uncategorized");
      expect(result.user).to.equal(userId);
      expect(result.list).to.equal("list123");
    });
  });

  describe("Singleton Pattern - DatabaseConnection", () => {
    it("should return the same database connection instance", () => {
      const connectionOne = new DatabaseConnection();
      const connectionTwo = new DatabaseConnection();

      expect(connectionOne).to.equal(connectionTwo);
    });
  });

  describe("Middleware Pattern - ValidationMiddleware", () => {
    it("should return 400 when item name is empty", () => {
      const req = {
        body: {
          name: "",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const next = sinon.spy();

      validateItemInput(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWithMatch({
          message: "Item name is required",
        })
      ).to.be.true;
      expect(next.called).to.be.false;
    });

    it("should call next when item name is valid", () => {
      const req = {
        body: {
          name: "Apple",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const next = sinon.spy();

      validateItemInput(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
    });
  });

  describe("Facade Pattern - DashboardFacade", () => {
    it("should return dashboard data with list information and item count", async () => {
      const mockLists = [
        {
          _id: "list123",
          title: "Weekly Grocery",
          createdAt: new Date("2026-05-01"),
        },
        {
          _id: "list456",
          title: "Party Food",
          createdAt: new Date("2026-05-02"),
        },
      ];

      sinon.stub(GroceryList, "find").returns({
        sort: sinon.stub().resolves(mockLists),
      });

      const countDocumentsStub = sinon.stub(Item, "countDocuments");
      countDocumentsStub.onFirstCall().resolves(3);
      countDocumentsStub.onSecondCall().resolves(5);

      const result = await DashboardFacade.getUserDashboard("user123");

      expect(GroceryList.find.calledOnce).to.be.true;
      expect(Item.countDocuments.calledTwice).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.include({
        _id: "list123",
        title: "Weekly Grocery",
        itemCount: 3,
      });
      expect(result[1]).to.include({
        _id: "list456",
        title: "Party Food",
        itemCount: 5,
      });
    });
  });

  describe("Strategy Pattern - ItemSortStrategy", () => {
    it("should sort items by name", () => {
      const items = [
        { name: "Milk", category: "Dairy", createdAt: "2026-05-02" },
        { name: "Apple", category: "Fruit", createdAt: "2026-05-01" },
      ];

      const sorter = new ItemSorter(new SortByName());
      const result = sorter.sort(items);

      expect(result[0].name).to.equal("Apple");
      expect(result[1].name).to.equal("Milk");
    });

    it("should sort items by category", () => {
      const items = [
        { name: "Apple", category: "Fruit", createdAt: "2026-05-01" },
        { name: "Milk", category: "Dairy", createdAt: "2026-05-02" },
      ];

      const sorter = new ItemSorter(new SortByCategory());
      const result = sorter.sort(items);

      expect(result[0].category).to.equal("Dairy");
      expect(result[1].category).to.equal("Fruit");
    });

    it("should change sorting strategy at runtime", () => {
      const items = [
        { name: "Milk", category: "Dairy", createdAt: "2026-05-02" },
        { name: "Apple", category: "Fruit", createdAt: "2026-05-01" },
      ];

      const sorter = new ItemSorter(new SortByName());
      let result = sorter.sort([...items]);
      expect(result[0].name).to.equal("Apple");

      sorter.setStrategy(new SortByDate());
      result = sorter.sort([...items]);
      expect(result[0].createdAt).to.equal("2026-05-02");
    });
  });
});