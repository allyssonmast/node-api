const { MissingParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usercase')

const makeSut = () => {
  class EncrypeterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }

  const encrypeterSpy = new EncrypeterSpy()
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypeterSpy)

  return {
    sut, loadUserByEmailRepositorySpy, encrypeterSpy
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
    const sut = new AuthUseCase()

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
    const { sut } = makeSut()
    const accessToke = await sut.auth('invalid_email@hotmail.com', 'password')

    expect(accessToke).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypeterSpy } = makeSut()
    await sut.auth('valid_email@hotmail.com', 'password')

    expect(encrypeterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
