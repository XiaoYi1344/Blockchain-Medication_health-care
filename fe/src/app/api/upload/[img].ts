import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { img } = req.query;

  if (!img || typeof img !== "string") {
    return res.status(400).send("Image name is required");
  }

  const filePath = path.join(process.cwd(), "public/uploads", img); // ảnh lưu trong public/uploads

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Image not found");
  }

  // Gửi file trực tiếp
  res.setHeader("Content-Type", "image/jpeg"); // hoặc png tùy file
  fs.createReadStream(filePath).pipe(res);
}
