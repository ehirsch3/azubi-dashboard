// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  if (!token) {
    console.log("No token found in cookies");
    // Redirect to /login when there is no token
    return res.redirect("/login");
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err);
      // Redirect to /login when token verification fails (invalid or expired token)
      return res.redirect("/login");
    }

    req.user = user; // Attach user information to the request object
    // Proceed to the next middleware or route handler
    let requestUrl = req.originalUrl;
    console.log("Request URL:", requestUrl);
    const adminRoutes = [
      /^\/api\/azubis/,
      /^\/api\/grades\/all/,
      /^\/api\/apprentices/,
      /^\/api\/remove-class/,
      /^\/api\/assign-class/,
      /^\/api\/classes/,
      /^\/api\/subjects/,
      /^\/api\/reports\/\d+\/approve/, // matches /api/reports/{number}/approve
      /^\/api\/reports\/\d+\/decline/, // matches /api/reports/{number}/decline
    ];

    // Check if the current request matches any of the admin routes.
    const isAdminPage = adminRoutes.some((pattern) => pattern.test(requestUrl));

    if (isAdminPage && !user.admin) {
      return res.redirect("/logout");
    } else {
      next();
    }
  });
};

export const checkAdmin = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    res
      .status(404)
      .json({ message: "No Token found", admin: false, token: false });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verif failed:", err);
      res
        .status(403)
        .json({ message: "Invalid Token", admin: false, token: false });
    }

    req.user = user; // Attach user information to the request object
    console.log("User", user);
    if (!user.admin) {
      console.log("User unauthorized");
      res
        .status(200)
        .json({ message: "Unauthorized", admin: false, token: true });
    } else {
      console.log("User authorized");
      res.status(200).json({ message: "Authorized", admin: true, token: true });
    }
  });
};
