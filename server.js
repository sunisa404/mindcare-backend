import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sql } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import phq9Route from "./routes/phq9Route.js";
import recommendVDORoute from "./routes/recommendVDORoute.js"
import moodTrackingRoute from "./routes/moodtrackingRoute.js";
import clerkRoute from "./routes/clerkRoute.js";
dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

const PORT = process.env.PORT || 5001;

//api สำหรับ คำตอบของ Users ที่ทำแบบประเมิน
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS phq9_results (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                q1 INT CHECK (q1 BETWEEN 0 AND 3),
                q2 INT CHECK (q2 BETWEEN 0 AND 3),
                q3 INT CHECK (q3 BETWEEN 0 AND 3),
                q4 INT CHECK (q4 BETWEEN 0 AND 3),
                q5 INT CHECK (q5 BETWEEN 0 AND 3),
                q6 INT CHECK (q6 BETWEEN 0 AND 3),
                q7 INT CHECK (q7 BETWEEN 0 AND 3),
                q8 INT CHECK (q8 BETWEEN 0 AND 3),
                q9 INT CHECK (q9 BETWEEN 0 AND 3),
                total_score INT GENERATED ALWAYS AS (
                q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9
                ) STORED,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await sql`
            CREATE TABLE IF NOT EXISTS RecommendVDO (
                id SERIAL PRIMARY KEY,
                photoId VARCHAR(255),
                titleLine1 VARCHAR(255),
                titleLine2 VARCHAR(255),
                sourceUrl VARCHAR(500)
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS mood_tracking (
                user_id VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                mood VARCHAR(50) NOT NULL,
                PRIMARY KEY (user_id, date)
            );
        `;
        console.log("Database initializing successfully");
    } catch (error) {
        console.error("Error initializing  DB", error);
        process.exit(1); // status code1 means failure, 0 success
    }
}

app.get("/", (req, res) => {
  res.send("MindCare API พร้อมใช้งานแล้ว!");
});

//api
app.use("/api/phq9", phq9Route); //แบบประเมิน
app.use("/api/recommendVDO", recommendVDORoute); //เกี่ยวกับวีดีโอ
app.use("/api/moodTracking", moodTrackingRoute); //ประเมินอารมณฺ์
app.use("/api/clerk", clerkRoute); //ผู้ใช้

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT", PORT);
    });
})
