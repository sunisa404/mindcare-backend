// routes/statsRoute.js
import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const result = await sql`
  SELECT 
    COUNT(*) AS total_assessments,
    COUNT(DISTINCT user_id) AS unique_users,
    SUM(CASE WHEN total_score >= 6 THEN 1 ELSE 0 END) AS depressed,
    SUM(CASE WHEN total_score < 6 THEN 1 ELSE 0 END) AS not_depressed
  FROM phq9_results;
`;

    const { total_assessments, unique_users, depressed, not_depressed } =
      result[0];

    res.json({
      totalAssessments: Number(total_assessments),
      totalUsers: Number(unique_users),
      depressed: Number(depressed),
      notDepressed: Number(not_depressed),
    });
  } catch (error) {
    console.error("Error fetching summary stats:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

// จำนวนการทำแบบประเมินรายเดือน
router.get("/monthly-assessments", async (req, res) => {
  try {
    const results = await sql`
      SELECT 
        TO_CHAR(submitted_at, 'YYYY-MM') AS month,
        COUNT(*) AS assessment_count
      FROM phq9_results
      GROUP BY month
      ORDER BY month ASC
    `;

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching monthly assessments:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายเดือน" });
  }
});

// API: คะแนนเฉลี่ยรายเดือน
router.get("/monthly-average-score", async (req, res) => {
  try {
    const results = await sql`
      SELECT 
        TO_CHAR(submitted_at, 'YYYY-MM') AS month,
        ROUND(AVG(total_score), 2) AS avg_score
      FROM phq9_results
      GROUP BY month
      ORDER BY month ASC
    `;

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching average scores:", error);
    res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการดึงคะแนนเฉลี่ยรายเดือน" });
  }
});

export default router;
