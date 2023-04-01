const { MissingParamError, InvalidParamError } = require('../../utils/erros')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepository)

  return {
    sut, loadUserByEmailRepository
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
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('email', 'password')

    expect(loadUserByEmailRepository.email).toBe('email')
  })

  test('Should throw if LoadUserByEmailRepository is not provide', async () => {
    const sut = new AuthUseCase()

    const promisse = sut.auth('email', 'pass')

    expect(promisse).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })
  test('Should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promisse = sut.auth('email', 'pass')

    expect(promisse).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  test('Should return null if LoadUserByEmailRepository return null', async () => {
    const { sut } = makeSut()
    const accessToke = await sut.auth('invalid_email@hotmail.com', 'password')

    expect(accessToke).toBeNull()
  })
})
