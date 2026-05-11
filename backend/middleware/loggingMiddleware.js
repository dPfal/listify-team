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

class LoggingMiddleware extends Middleware {
  process(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    super.process(req, res, next);
  }
}

const loggingMiddleware = (req, res, next) => {
  const logger = new LoggingMiddleware();
  logger.process(req, res, next);
};

module.exports = loggingMiddleware;
module.exports.Middleware = Middleware;
module.exports.LoggingMiddleware = LoggingMiddleware;