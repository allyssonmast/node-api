const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
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
