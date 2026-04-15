export interface LoginPayload {
  phoneNumber: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}
