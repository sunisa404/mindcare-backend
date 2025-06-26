import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

//api สำหรับ เพิ่มวิดีโอแนะนำของ Admin
router.post("/postVdo", async (req, res) => {
  try {
    const { photoId, titleLine1, titleLine2, sourceUrl } = req.body;

    // ตรวจสอบข้อมูลว่าครบหรือไม่
    if (!photoId || !titleLine1 || !titleLine2 || !sourceUrl) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }

    await sql`
      INSERT INTO RecommendVDO (
        photoId, titleLine1, titleLine2, sourceUrl
      ) VALUES (
        ${photoId}, ${titleLine1}, ${titleLine2}, ${sourceUrl}
      );
    `;

    res.status(200).json({ message: "เพิ่มวิดีโอแนะนำสำเร็จ" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "ไม่สามารถเพิ่มวิดีโอได้" });
  }
});

//api สำหรับ ดึงข้อมูลวิดีโอทั้งหมด
router.get("/", async (req, res) => {
  try {
    const results = await sql`SELECT * FROM RecommendVDO ORDER BY id DESC;`;
    res.status(200).json(results);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลได้" });
  }
});

//api สำหรับ ลบวิดีโอแนะนำตาม id ของ Admin
router.delete("/deleteVdo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: "ไม่ได้ระบุ ID" });

    await sql`DELETE FROM RecommendVDO WHERE id = ${id}`;
    res.status(200).json({ message: "ลบวิดีโอสำเร็จ" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "ไม่สามารถลบวิดีโอได้" });
  }
});

//api สำหรับ แก้ไขวิดีโอแนะนำ ของ admin
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { photoId, titleLine1, titleLine2, sourceUrl } = req.body;

  // ตรวจสอบว่าข้อมูลครบหรือไม่
  if (!photoId || !titleLine1 || !titleLine2 || !sourceUrl) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const result = await sql`
      UPDATE RecommendVDO
      SET photoId = ${photoId},
          titleLine1 = ${titleLine1},
          titleLine2 = ${titleLine2},
          sourceUrl = ${sourceUrl}
      WHERE id = ${id}
    `;

    if (result.count === 0) {
      return res.status(404).json({ message: "ไม่พบวิดีโอที่ต้องการแก้ไข" });
    }

    res.status(200).json({ message: "แก้ไขวิดีโอสำเร็จ" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "ไม่สามารถแก้ไขวิดีโอได้" });
  }
});


export default router;