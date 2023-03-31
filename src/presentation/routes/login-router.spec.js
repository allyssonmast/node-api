class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest("email");
    }
    if (!password) {
      return HttpResponse.badRequest("password");
    }
  }
}

class HttpResponse {
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
}

class MissingParamError extends Error {
  constructor(paraName) {
    super(`Missing param: ${paraName}`);
    this.name = "MissingParamError";
  }
}

describe("Login Router", () => {
  test("Shold return 400 if no email provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Shold return 400 if no password provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "email@email.com",
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("Shold return 500 if no httpRequest provided", () => {
    const sut = new LoginRouter();

    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold return 500 if httpRequest has no body", () => {
    const sut = new LoginRouter();
    const httpRequest = {};

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
