
const { UnauthorizedError, ServerError } = require('../erros')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static unAuthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}
