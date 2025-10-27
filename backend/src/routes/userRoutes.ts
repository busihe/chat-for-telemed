// routes/userRoutes.ts
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    { _id: "user-1", name: "Patient kevin" },
    { _id: "user-2", name: "Doctor Alex" },
    { _id: "user-3", name: "User-User1" },
  ]);
});

export default router;
