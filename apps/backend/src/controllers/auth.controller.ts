import { Request, Response } from "express"
import {
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/crypto.utils"
import { AppError } from "../utils/app-error.utils"

import bcrypt from "bcryptjs"

import { prisma } from "../config/db"
// --- 1. USER REGISTRATION ---
export const handleRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, name, role } = req.body

  if (!username || !password) {
    throw new AppError("Username and password are required credentials.", 400)
  }

  // Check if account already exists
  const existingUser = await prisma.user.findUnique({ where: { username } })
  if (existingUser) {
    throw new AppError("This username is already taken.", 409)
  }

  // Hash your password before committing to the database
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      name,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "USER", // Restrict or adjust based on system sign-up rules
    },
  })

  res.status(201).json({
    message: "User registered successfully",
    userId: newUser.id,
  })
}

// --- 2. USER LOGIN ---
export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new AppError("Please provide both a username and password.", 400)
  }

  // Locate the user profile configuration
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    throw new AppError("Invalid login credentials.", 401)
  }

  // Verify crypt hash matches submitted plaintext string
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new AppError("Invalid login credentials.", 401)
  }

  // Generate tokens including user meta definitions
  const tokenPayload = { userId: user.id, role: user.role }
  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  // Set refresh token inside a secure cookie for web clients
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token life
  })

  // Return everything down to the client layout
  res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken, // Explicitly returned for your React Native state engines
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  })
}

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Grab the refresh token from cookies (web) or body (mobile)
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401)
  }

  // 2. Verify the token using our utility
  // Express 5 will instantly catch any verification errors and handle them globally
  const payload = verifyRefreshToken(refreshToken)

  // 3. (Optional but recommended) Check if user exists in the DB
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) throw new AppError("User no longer exists", 401)

  // 4. Generate a brand new short-lived access token
  const newAccessToken = generateAccessToken(payload)

  // 5. Return the new access token to the client
  res.status(200).json({
    accessToken: newAccessToken,
  })
}
