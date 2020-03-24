import { User } from "./entity/User";
import { sign, verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from './MyContext'

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "20m"
  })
}

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id, email: user.email, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d"
  })
}


// bearer 0122
export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error("not authenticated")
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    context.payload = payload as any
  } catch (error) {
    throw new Error("not authenticated")
  }
  return next()
}
