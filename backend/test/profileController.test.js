const chai = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { updateProfile } = require("../controllers/userController");

const { expect } = chai;

describe("Profile Management Functional Test", () => {
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

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    sinon.stub(User, "findById").resolves(mockUser);

    await updateProfile(req, res);

    expect(mockUser.displayName).to.equal("CUI");
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: "Profile updated successfully",
      })
    ).to.be.true;
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

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    sinon.stub(User, "findById").resolves(mockUser);
    sinon.stub(bcrypt, "hash").resolves("hashedPassword123");

    await updateProfile(req, res);

    expect(mockUser.password).to.equal("hashedPassword123");
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: "Profile updated successfully",
      })
    ).to.be.true;
  });

  it("should return 404 when user is not found", async () => {
    const req = {
      user: { id: "missingUser" },
      body: {
        displayName: "CUI",
        password: "",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    sinon.stub(User, "findById").resolves(null);

    await updateProfile(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: "User not found",
      })
    ).to.be.true;
  });
});