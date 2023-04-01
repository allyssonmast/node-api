class ServerError extends Error {
  constructor (params) {
    super('Internal Error')
    this.name = 'ServerError'
  }
}

module.exports = ServerError
