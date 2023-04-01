const { MissingParamError } = require('../../utils/erros')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypeter) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypeter = encrypeter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
    await this.encrypeter.compare(password, user.password)
    return null
  }
}
