declare namespace Auth {
  interface LoginPayload {
    phoneNumber: string
    password: string
  }
  interface LoginResult {
    accessToken: string
    refreshToken: string
  }
}
