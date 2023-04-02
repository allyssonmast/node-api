const EmailValidator = require('../helpers/email-validator')
const validator = require('validator')
const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('should return true if validator returns true', () => {
    const sut = makeSut()

    const isEmailValid = sut.isValid('valid@hotmail.com')

    expect(isEmailValid).toBe(true)
  })

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()

    const isEmailValid = sut.isValid('valid')

    expect(isEmailValid).toBe(false)
  })

  test('Shold call validator with correct email', () => {
    const sut = makeSut()

    sut.isValid('valid')

    expect(validator.email).toBe('valid')
  })
})
