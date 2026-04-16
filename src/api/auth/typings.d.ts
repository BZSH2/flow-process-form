declare namespace Auth {
  interface LoginPayload {
    phoneNumber: string
    password: string
  }

  interface Tokens {
    accessToken: string
    refreshToken: string
  }

  type LoginResult = Tokens

  interface OperationMessage {
    message: string
  }
}
