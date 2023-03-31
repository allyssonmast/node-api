const MissingParamError = require("./missing-param-error");
const UnAuthorizedError = require("./unAuthorized-error");

module.exports = class HttpResponse {
  static badRequest(paraName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paraName),
    };
  }
  static serverError() {
    return {
      statusCode: 500,
    };
  }
  static unAuthorized() {
    return {
      statusCode: 401,
      body: new UnAuthorizedError(),
    };
  }
};
