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

export default router;
