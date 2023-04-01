class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}

describe('Auth Usecase', () => {
  test('Should throw if email is not provider', async () => {
    const sut = new AuthUseCase()
    const promisse = sut.auth()

    expect(promisse).rejects.toThrow()
  })
})
