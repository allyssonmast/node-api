const MissingParamError = require("./missing-param-error");

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
};
