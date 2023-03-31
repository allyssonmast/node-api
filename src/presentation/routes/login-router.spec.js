const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
const UnAuthorizedError = require("../helpers/unAuthorized-error");

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy);

  return { sut, authUseCaseSpy };
};

const makeAuthUseCase = () => {
  class AuthusecaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  return new AuthusecaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthusecaseSpy {
    auth(email, password) {
      throw new Error()
    }
  }
  return new AuthusecaseSpy()
}

describe("Login Router", () => {
  test("Shold return 400 if no email provided", () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold return 500 if httpRequest has no body", () => {
    const { sut } = makeSut();
    const httpRequest = {};

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold call Authusecase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "any_password",
      },
    };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });


  test("Shold return 401 when invalid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: "invalided@email.com",
        password: "invalided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnAuthorizedError());
  });

  test("Shold return 200 when valid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "valided@email.com",
        password: "valided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Shold return 500 if no authUseCase is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "valided@email.com",
        password: "valided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold return 500 if no authUseCase has no auth", () => {
    class AuthusecaseSpy { }
    const authUseCaseSpy = new AuthusecaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "valided@email.com",
        password: "valided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold return 500 if no authUseCase has no auth", () => {
    class AuthusecaseSpy { }
    const authUseCaseSpy = new AuthusecaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "valided@email.com",
        password: "valided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Shold throw if any dependency throw", () => {

    const authUseCaseSpy = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "valided@email.com",
        password: "valided",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});
