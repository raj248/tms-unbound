import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { AppError } from "./app-error.utils"
// @ts-ignore - Property '@prisma/client' does not exist until Prisma is generated
import { Role } from "@prisma/client"

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export interface TokenPayload {
  userId: number
  role: Role
}

/**
 * Password Management
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed)
}

/**
 * Access Tokens
 */
export const generateAccessToken = ({ userId, role }: TokenPayload): string => {
  // Destructuring prevents old 'iat' and 'exp' fields from hijacking options.expiresIn
  const cleanPayload = { userId, role }
  return jwt.sign(cleanPayload, JWT_ACCESS_SECRET, { expiresIn: "15m" })
}

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload
  } catch (error: any) {
    // Forward the error cleanly with an explicit 401 status code
    throw new AppError(error.message || "Invalid access token", 401)
  }
}

/**
 * Refresh Tokens
 */
export const generateRefreshToken = ({
  userId,
  role,
}: TokenPayload): string => {
  try {
    // Destructuring here too in case you rotate refresh tokens somewhere down the line
    const cleanPayload = { userId, role }
    return jwt.sign(cleanPayload, JWT_REFRESH_SECRET)
  } catch (error: any) {
    throw new AppError(
      error.name === "TokenExpiredError"
        ? "Refresh token expired"
        : "Invalid refresh token",
      403
    )
  }
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
  } catch (error: any) {
    // Intercept jwt validation failures and convert them to explicit 403 Forbidden errors
    throw new AppError(
      error.name === "TokenExpiredError"
        ? "Refresh token expired"
        : "Invalid refresh token",
      403
    )
  }
}
