class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
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
  });
});