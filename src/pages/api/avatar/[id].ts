// pages/api/avatar/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).send("Missing avatar ID");

  try {
    const cloudUrl = `https://res.cloudinary.com/dr6cnnvma/image/upload/v1759465089/${id}.jpg`;
    const response = await axios.get(cloudUrl, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(404).send("Avatar not found");
  }
}
