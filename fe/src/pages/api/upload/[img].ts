import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { img } = req.query;

  if (!img || typeof img !== "string") {
    return res.status(400).send("Image name is required");
  }

  const filePath = path.join(process.cwd(), "uploads", img); // thư mục lưu ảnh

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Image not found");
  }

  // xác định Content-Type theo extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".png" ? "image/png" :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    "application/octet-stream";

  res.setHeader("Content-Type", contentType);
  fs.createReadStream(filePath).pipe(res);
}
