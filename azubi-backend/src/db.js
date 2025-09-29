import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Graceful shutdown handler
const closeDbConnection = async () => {
  try {
    await db.end(); // Close client pool gracefully
    console.log("Database connection closed successfully.");
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
};

// Attach the shutdown handler to process events
process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDbConnection();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDbConnection();
  process.exit();
});

// Export query function
export const query = (text, params) => db.query(text, params);

export default db;
