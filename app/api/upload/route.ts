import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import crypto from "crypto";
import redis from "@/app/lib/redis";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function hashSecret(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const ttl = Number(formData.get("ttl")) || 3600; 

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = nanoid();
    const filename = `${Date.now()}_${id}_${file.name}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filepath, buffer);

    
    const secret = crypto.randomBytes(16).toString("hex"); 
    const secretHash = hashSecret(secret);

    const metaKey = `file:${filename}`;
    const meta = { filepath, uploadedAt: Date.now(), secretHash };

    
    await redis.set(metaKey, JSON.stringify(meta), { EX: ttl });

   
    await redis.sAdd("files", metaKey);

    return NextResponse.json({
      message: "Файл успешно загружен",
      filename,
      expiresIn: ttl,
      secret,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка при загрузке файла" }, { status: 500 });
  }
}
