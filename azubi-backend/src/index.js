import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import azubiRoutes from "./routes/azubiRoute.js";
import calendarRoutes from "./routes/calendarRoute.js";
import apprenticeGradesRoutes from "./routes/apprenticeGradesRoute.js";
import apprenticeClassRoutes from "./routes/apprenticeClassRoute.js";
import apprenticeReportRoutes from "./routes/apprenticeReportRoute.js";
import apprenticeSubjectRoute from "./routes/apprenticeSubjectRoute.js";

dotenv.config();

const app = express();
const port = 3002;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", azubiRoutes);
app.use("/api", calendarRoutes);
app.use("/api", apprenticeGradesRoutes);
app.use("/api", apprenticeClassRoutes);
app.use("/api", apprenticeReportRoutes);
app.use("/api", apprenticeSubjectRoute);

//Scheduled task to update reminder bool, operation once a day at midnight

// cron.schedule("0 0 * * *", async () => {  // This will run once a day at midnight
//   try {
//     const currentTime = new Date().toISOString(); // Get the current time in ISO format
//     console.log("Running reminder update check at:", currentTime);

//     // SQL query to update reminder field where reminder_time is in the past and reminder is false, ignoring NULL reminder_times
//     const sql = `
//       UPDATE apprentice_calendar
//       SET reminder = TRUE
//       WHERE reminder_time IS NOT NULL AND reminder_time < $1 AND reminder = FALSE;
//     `;

//     const result = await query(sql, [currentTime]);

//     console.log(`Updated ${result.rowCount} entries with reminders.`);
//   } catch (err) {
//     console.error("Error during reminder update check:", err);
//   }
// });

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
