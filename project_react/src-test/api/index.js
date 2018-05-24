import ajax from './ajax'

export const reqRegister = (user)=> ajax('POST','/register',user)

export const reqLogin = (user)=> ajax('POST','/login',user)