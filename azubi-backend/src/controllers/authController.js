import jwt from "jsonwebtoken";
import { query } from "../db.js";

// Login function: Authenticates the user and returns a JWT token.
export const login = async (req, res) => {
  const { name, pass } = req.body;

  function checkAdmin(id_person) {
    const adminArr = [2880, 8860];
    if (adminArr.includes(id_person)) {
      return true;
    }
    return false;
  }

  try {
    // Query to check if the user exists and validate the credentials
    const result = await query(
      `SELECT 
    users.id, 
    users.name, 
    users.id_person, 
    person.firstname, 
    person.lastname, 
    users.pass 
   FROM users
   JOIN person ON users.id_person = person.id
   WHERE users.name = $1`,
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check if the password matches (assuming passwords are stored as plain text)
    if (user.pass !== pass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      id_person: user.id_person,
      admin: checkAdmin(user.id_person),
    };

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Can't be accessed via JavaScript
      secure: false,
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 10800000, // Token expires in 3 hour
    });

    // Respond with user information (excluding password) and the token
    const userResponse = {
      id: user.id,
      id_person: user.id_person,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    return res.json({
      message: "Login successful",
      user: userResponse,
      token: token, // Include the token in the response
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
