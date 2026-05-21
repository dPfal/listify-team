const chai = require("chai");
const sinon = require("sinon");

const ItemFactory = require("../factories/itemFactory");
const { DatabaseConnection } = require("../config/db");
const { validateItemInput } = require("../middleware/validationMiddleware");

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
});