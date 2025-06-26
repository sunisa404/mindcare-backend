import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

// POST /mood
router.post("/postMood", async (req, res) => {
  const { user_id, date, mood } = req.body;
  if (!user_id || !date || !mood) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  try {
    await sql`
      INSERT INTO mood_tracking (user_id, date, mood)
      VALUES (${user_id}, ${date}, ${mood})
      ON CONFLICT (user_id, date)
      DO UPDATE SET mood = EXCLUDED.mood
    `;
    res.status(200).json({ message: "บันทึกอารมณ์สำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// GET /mood?user_id=xxx
router.get("/getMoodUser/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await sql`
      SELECT date, mood FROM mood_tracking
      WHERE user_id = ${user_id}
      ORDER BY date DESC
      LIMIT 14
    `;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

router.delete('/deleteAll/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    await sql`
      DELETE FROM mood_tracking WHERE user_id = ${user_id}
    `;
    res.json({ message: 'ลบข้อมูลเรียบร้อย' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
});


export default router;
