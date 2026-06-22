import { Router } from "express"
import {
  handleLogin,
  handleRefreshToken,
  handleRegister,
} from "../controllers/auth.controller"
import { requireAuth } from "../middlewares/auth.middleware"

const router: Router = Router()

// Public onboarding gateways
router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.post("/refresh", handleRefreshToken)

// Simple diagnostic route to test your requireAuth layer
router.get("/me", requireAuth, (req, res) => {
  // Safe from typescript compilation warnings due to our global namespace definition
  res.status(200).json({
    authenticated: true,
    user: (req as any).user,
  })
})

export default router
