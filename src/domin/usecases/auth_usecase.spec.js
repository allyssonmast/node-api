const { MissingParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usercase')

const makeEncrypter = () => {
  class EncrypeterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypeterSpy = new EncrypeterSpy()
  encrypeterSpy.isValid = true
  return encrypeterSpy
}
const makeTokerGenerator = () => {
  class TokerGenerator {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokerGenerator = new TokerGenerator()
  tokerGenerator.accessToken = 'any_token'

  return tokerGenerator
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}
const makeSut = () => {
  const encrypeterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokerGeneratorSpy = makeTokerGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypeter: encrypeterSpy,
    tokenGenerator: tokerGeneratorSpy
  })

  return {
    sut, loadUserByEmailRepositorySpy, encrypeterSpy, tokerGeneratorSpy
  }
}

describe('Auth Usecase', () => {
  test('Should throw if email is not provider', async () => {
    const { sut } = makeSut()
    const promisse = sut.auth()

    expect(promisse).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if password is not provider', async () => {
    const { sut } = makeSut()
    const promisse = sut.auth('email')

    expect(promisse).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('email', 'password')

    expect(loadUserByEmailRepositorySpy.email).toBe('email')
  })

  test('Should throw if LoadUserByEmailRepository is not provide', async () => {
    const sut = new AuthUseCase({})

    const promisse = sut.auth('email', 'pass')

    expect(promisse).rejects.toThrow()
  })
  test('Should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promisse = sut.auth('email', 'pass')

    expect(promisse).rejects.toThrow()
  })

  test('Should return null if invalid email id provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToke = await sut.auth('invalid_email@hotmail.com', 'password')

    expect(accessToke).toBeNull()
  })
  test('Should return null if invalid password is provided', async () => {
    const { sut, encrypeterSpy } = makeSut()
    encrypeterSpy.isValid = false
    const accessToke = await sut.auth('invalid_email@hotmail.com', 'password')

    expect(accessToke).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypeterSpy } = makeSut()
    await sut.auth('valid_email@hotmail.com', 'password')

    expect(encrypeterSpy.password).toBe('password')
    expect(encrypeterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
  test('Should call TokenGeneratir with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokerGeneratorSpy } = makeSut()
    await sut.auth('valid_email@hotmail.com', 'password')

    expect(tokerGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })
  test('Should return an accessToken if credentials are provided', async () => {
    const { sut, tokerGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@hotmail.com', 'password')

    expect(accessToken).toBe(tokerGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
