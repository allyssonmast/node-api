const { MissingParamError } = require('../../utils/erros')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, encrypeter, tokenGenerator }) {
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
    if (user && await this.encrypeter.compare(password, user.password)) {
      return await this.tokenGenerator.generate(user.id)
    }

    return null
  }
}
