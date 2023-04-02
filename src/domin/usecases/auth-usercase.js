const { MissingParamError } = require('../../utils/erros')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypeter, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypeter = encrypeter
    this.tokenGenerator = tokenGenerator
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
    const isValid = await this.encrypeter.compare(password, user.password)
    if (!isValid) {
      return null
    }
    await this.tokenGenerator.generate(user.id)
  }
}
