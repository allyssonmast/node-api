const MissingParamError = require("./missing-param-error");
const UnAuthorizedError = require("./unAuthorized-error");
const ServerError = require("./server-error");

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
      body: new ServerError(),
    };
  }
  static ok(data) {
    return {
      statusCode: 200,
      body: data
    };
  }
  static unAuthorized() {
    return {
      statusCode: 401,
      body: new UnAuthorizedError(),
    };
  }
};
