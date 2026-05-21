const assert = require("assert");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Item = require("../models/Item");
const GroceryList = require("../models/GroceryList");

const { updateProfile } = require("../controllers/userController");
const { registerUser, loginUser } = require("../controllers/authController");
const {
  createList,
  getLists,
  updateList,
  deleteList,
} = require("../controllers/groceryListController");
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  clearAllItems,
  getItemSuggestions,
} = require("../controllers/itemController");


const createMockResponse = () => ({
  status: sinon.stub().returnsThis(),
  json: sinon.spy(),
});

describe("Functional Testing - User Registration", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should register a new user successfully", async () => {
    const req = {
      body: {
        username: "newuser@test.com",
        password: "password123",
      },
    };

    const res = createMockResponse();

    const createdUser = {
      _id: "user123",
      username: "newuser@test.com",
      password: "hashedPassword123",
      listName: "newuser@test.com's Grocery List",
    };

    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(bcrypt, "hash").resolves("hashedPassword123");
    sinon.stub(User, "create").resolves(createdUser);

    await registerUser(req, res);

    assert.strictEqual(User.findOne.calledOnce, true);
    assert.strictEqual(User.create.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });

  it("should return 400 if user already exists", async () => {
    const req = {
      body: {
        username: "existing@test.com",
        password: "password123",
      },
    };

    const res = createMockResponse();

    sinon.stub(User, "findOne").resolves({
      _id: "user123",
      username: "existing@test.com",
    });

    await registerUser(req, res);

    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledOnce, true);
  });
});

describe("Functional Testing - User Login", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should login user successfully", async () => {
    const req = {
      body: {
        username: "newuser@test.com",
        password: "password123",
      },
    };

    const res = createMockResponse();

    const mockUser = {
      _id: "user123",
      username: "newuser@test.com",
      password: "hashedPassword123",
      listName: "newuser@test.com's Grocery List",
    };

    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(bcrypt, "compare").resolves(true);

    await loginUser(req, res);

    assert.strictEqual(User.findOne.calledOnce, true);
    assert.strictEqual(bcrypt.compare.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });

  it("should return 400 for invalid credentials", async () => {
    const req = {
      body: {
        username: "wrong@test.com",
        password: "wrongpassword",
      },
    };

    const res = createMockResponse();

    sinon.stub(User, "findOne").resolves(null);

    await loginUser(req, res);

    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledOnce, true);
  });
});

describe("Functional Testing - Profile Management", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should update display name successfully", async () => {
    const mockUser = {
      _id: "user123",
      username: "JUNJIE CUI",
      displayName: "Old Name",
      password: "oldPassword",
      save: sinon.stub().resolvesThis(),
    };

    const req = {
      user: { id: "user123" },
      body: {
        displayName: "CUI",
        password: "",
      },
    };

    const res = createMockResponse();

    sinon.stub(User, "findById").resolves(mockUser);

    await updateProfile(req, res);

    assert.strictEqual(mockUser.displayName, "CUI");
    assert.strictEqual(res.status.calledWith(200), true);
    assert.strictEqual(
      res.json.calledWithMatch({ message: "Profile updated successfully" }),
      true
    );
  });

  it("should update password successfully", async () => {
    const mockUser = {
      _id: "user123",
      username: "JUNJIE CUI",
      displayName: "CUI",
      password: "oldPassword",
      save: sinon.stub().resolvesThis(),
    };

    const req = {
      user: { id: "user123" },
      body: {
        displayName: "CUI",
        password: "newPassword123",
      },
    };

    const res = createMockResponse();

    sinon.stub(User, "findById").resolves(mockUser);
    sinon.stub(bcrypt, "hash").resolves("hashedPassword123");

    await updateProfile(req, res);

    assert.strictEqual(mockUser.password, "hashedPassword123");
    assert.strictEqual(res.status.calledWith(200), true);
  });

  it("should return 404 when user is not found", async () => {
    const req = {
      user: { id: "missingUser" },
      body: {
        displayName: "CUI",
        password: "",
      },
    };

    const res = createMockResponse();

    sinon.stub(User, "findById").resolves(null);

    await updateProfile(req, res);

    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(
      res.json.calledWithMatch({ message: "User not found" }),
      true
    );
  });
});

describe("Functional Testing - Grocery List Management", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a grocery list successfully", async () => {
    const req = {
      user: { id: "user123" },
      body: {
        title: "Weekly Grocery",
      },
    };

    const res = createMockResponse();

    const createdList = {
      _id: "list123",
      title: "Weekly Grocery",
      user: "user123",
    };

    sinon.stub(GroceryList, "create").resolves(createdList);

    await createList(req, res);

    assert.strictEqual(res.status.calledWith(201), true);
    assert.strictEqual(res.json.calledWith(createdList), true);
  });

  it("should get all grocery lists for the logged-in user", async () => {
    const req = {
      user: { id: "user123" },
    };

    const res = createMockResponse();

    const lists = [
      {
        _id: "list123",
        title: "Weekly Grocery",
        user: "user123",
      },
      {
        _id: "list456",
        title: "Party Food",
        user: "user123",
      },
    ];

    sinon.stub(GroceryList, "find").returns({
      sort: sinon.stub().resolves(lists),
    });

    await getLists(req, res);

    assert.strictEqual(GroceryList.find.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });

  it("should update a grocery list title successfully", async () => {
    const mockList = {
      _id: "list123",
      title: "Old List",
      user: {
        toString: () => "user123",
      },
      save: sinon.stub().resolvesThis(),
    };

    const req = {
      user: { id: "user123" },
      params: { id: "list123" },
      body: {
        title: "Updated List",
      },
    };

    const res = createMockResponse();

    sinon.stub(GroceryList, "findById").resolves(mockList);

    await updateList(req, res);

    assert.strictEqual(mockList.title, "Updated List");
    assert.strictEqual(res.json.calledWith(mockList), true);
  });

  it("should delete a grocery list and its items successfully", async () => {
    const mockList = {
      _id: "list123",
      user: {
        toString: () => "user123",
      },
      deleteOne: sinon.stub().resolves(),
    };

    const req = {
      user: { id: "user123" },
      params: { id: "list123" },
    };

    const res = createMockResponse();

    sinon.stub(GroceryList, "findById").resolves(mockList);
    sinon.stub(Item, "deleteMany").resolves();

    await deleteList(req, res);

    assert.strictEqual(Item.deleteMany.calledOnce, true);
    assert.strictEqual(mockList.deleteOne.calledOnce, true);
    assert.strictEqual(res.status.calledWith(200), true);
  });
});

describe("Functional Testing - Item Management", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should create an item successfully", async () => {
    const req = {
      user: { id: "user123" },
      body: {
        name: "Milk",
        quantity: 2,
        category: "Dairy",
        list: "list123",
      },
    };

    const res = createMockResponse();

    const createdItem = {
      _id: "item123",
      name: "Milk",
      quantity: 2,
      category: "Dairy",
      user: "user123",
      list: "list123",
    };

    sinon.stub(Item, "findOne").resolves(null);
    sinon.stub(Item, "create").resolves(createdItem);

    await createItem(req, res);

    assert.strictEqual(res.status.calledWith(201), true);
    assert.strictEqual(res.json.calledWith(createdItem), true);
  });

  it("should get items for a selected grocery list", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        list: "list123",
      },
    };

    const res = createMockResponse();

    const items = [
      {
        _id: "item123",
        name: "Milk",
        list: "list123",
        user: "user123",
      },
    ];

    sinon.stub(Item, "find").returns({
      sort: sinon.stub().resolves(items),
    });

    await getItems(req, res);

    assert.strictEqual(Item.find.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });

  it("should update an item successfully", async () => {
    const mockItem = {
      _id: "item123",
      name: "Milk",
      quantity: 1,
      category: "Dairy",
      completed: false,
      user: {
        toString: () => "user123",
      },
      save: sinon.stub().resolvesThis(),
    };

    const req = {
      user: { id: "user123" },
      params: {
        id: "item123",
      },
      body: {
        name: "Bread",
        quantity: 3,
        category: "Bakery",
        completed: true,
      },
    };

    const res = createMockResponse();

    sinon.stub(Item, "findById").resolves(mockItem);

    await updateItem(req, res);

    assert.strictEqual(Item.findById.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });

  it("should delete an item successfully", async () => {
    const mockItem = {
      _id: "item123",
      user: {
        toString: () => "user123",
      },
      deleteOne: sinon.stub().resolves(),
    };

    const req = {
      user: { id: "user123" },
      params: {
        id: "item123",
      },
    };

    const res = createMockResponse();

    sinon.stub(Item, "findById").resolves(mockItem);

    await deleteItem(req, res);

    assert.strictEqual(mockItem.deleteOne.calledOnce, true);
    assert.strictEqual(
      res.json.calledWithMatch({ message: "Item deleted" }),
      true
    );
  });

  it("should clear all items in a selected grocery list", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        list: "list123",
      },
    };

    const res = createMockResponse();

    sinon.stub(Item, "deleteMany").resolves({
      deletedCount: 3,
    });

    await clearAllItems(req, res);

    assert.strictEqual(Item.deleteMany.calledOnce, true);
    assert.strictEqual(res.status.calledWith(200), true);
  });

  it("should return item suggestions", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        query: "mi",
      },
    };

    const res = createMockResponse();

    const suggestions = [
      {
        _id: "item123",
        name: "Milk",
        category: "Dairy",
        user: "user123",
      },
    ];

    sinon.stub(Item, "find").returns({
      limit: sinon.stub().resolves(suggestions),
    });

    await getItemSuggestions(req, res);

    assert.strictEqual(Item.find.calledOnce, true);
    assert.strictEqual(res.json.calledOnce, true);
  });
});

