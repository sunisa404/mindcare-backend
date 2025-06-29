import express from "express";
import { clerkClient } from "@clerk/express";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList();

    const result = users.data
      .filter((user) => user.publicMetadata?.role !== "admin") // เฉพาะผู้ใช้ที่ไม่ใช่แอดมิน
      .map((user) => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        role: user.publicMetadata?.role || "user",
        createdAt: user.createdAt,
      }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await clerkClient.users.getUser(id);

    if (!user) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    }

    const result = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      createdAt: user.createdAt,
      imageUrl: user.imageUrl,
    };

    res.json(result);
  } catch (err) {
    console.error("❌ ดึงข้อมูลผู้ใช้ล้มเหลว:", err.message || err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
});

export default router;
