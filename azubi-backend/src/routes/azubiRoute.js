import express from "express";
import * as azubiController from "../controllers/azubiController.js";
import * as authController from "../controllers/authController.js"; // Import the login controller
import { authenticateJWT, checkAdmin } from "../middleware/authMiddleware.js"; // Token authentication middleware

const router = express.Router();

// POST route for login
router.post("/login", authController.login); // New login route
router.get("/authAdmin", checkAdmin);

// Apply the middleware to all routes that need protection
router.get("/azubis", authenticateJWT, azubiController.getAzubis);
router.put(
  "/azubis/create/:id_person",
  authenticateJWT,
  azubiController.createAzubis
);
router.put(
  "/azubis/delete/:id_person",
  authenticateJWT,
  azubiController.deleteAzubis
);
router.get("/azubis/search", authenticateJWT, azubiController.searchAzubis);

// Route to log the user out (clear the JWT cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the cookie containing the JWT token
  res.json({ message: "Logged out successfully" });
});

router.get("/me", authenticateJWT, async (req, res) => {
  try {
    const { firstname, lastname } = req.user; // Get from the JWT token payload

    res.status(200).json({ firstname, lastname });
  } catch (error) {
    console.log("Error fetching user data", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
