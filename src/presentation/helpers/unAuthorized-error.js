module.exports = class unAuthorizedError extends Error {
  constructor(paraName) {
    super("unAuthorized");
    this.name = "unAuthorizedError";
  }
};
