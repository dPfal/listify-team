class Middleware {
  constructor(nextMiddleware = null) {
    this.nextMiddleware = nextMiddleware;
  }

  process(req, res, next) {
    if (this.nextMiddleware) {
      return this.nextMiddleware.process(req, res, next);
    }

    next();
  }
}

class ValidationMiddleware extends Middleware {
  process(req, res, next) {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Item name is required" });
    }

    super.process(req, res, next);
  }
}

const validateItemInput = (req, res, next) => {
  const validator = new ValidationMiddleware();
  validator.process(req, res, next);
};

module.exports = { validateItemInput, Middleware, ValidationMiddleware };