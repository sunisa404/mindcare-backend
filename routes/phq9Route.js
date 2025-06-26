import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

//api สำหรับ คำตอบของ Users ที่ทำแบบประเมิน
router.post("/post", async (req, res) => {
  try {
    const { user_id, q1, q2, q3, q4, q5, q6, q7, q8, q9 } = req.body;

    // เช็กข้อมูลที่ส่งมาครบหรือไม่
    if (
      user_id === undefined || q1 === undefined || q2 === undefined ||
      q3 === undefined || q4 === undefined || q5 === undefined ||
      q6 === undefined || q7 === undefined || q8 === undefined || q9 === undefined
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกข้อ" });
    }

    // บันทึกข้อมูล
    await sql`
      INSERT INTO phq9_results (
        user_id, q1, q2, q3, q4, q5, q6, q7, q8, q9
      ) VALUES (
        ${user_id}, ${q1}, ${q2}, ${q3}, ${q4},
        ${q5}, ${q6}, ${q7}, ${q8}, ${q9}
      );
    `;

    res.status(200).json({
      message: "บันทึกผลการประเมินสำเร็จ"
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "มีข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const results = await sql`SELECT * FROM phq9_results;`;
    res.status(200).json(results);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "มีข้อผิดพลาดในการดึงข้อมูล" });
  }
});

export default router;
