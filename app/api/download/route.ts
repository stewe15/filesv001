import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import crypto from "crypto";
import redis from "@/app/lib/redis";

function hashSecret(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename");
    const secret = url.searchParams.get("secret");

    if (!filename || !secret) {
      return NextResponse.json({ error: "Missing filename or secret" }, { status: 400 });
    }

    const metaKey = `file:${filename}`;
    const raw = await redis.get(metaKey);

    if (!raw) {
      return NextResponse.json({ error: "Ключ не найден или истёк" }, { status: 404 });
    }

    const meta = JSON.parse(raw) as { filepath: string; secretHash: string };

    const providedHash = hashSecret(secret);
    if (providedHash !== meta.secretHash) {
      return NextResponse.json({ error: "Неверный секрет" }, { status: 403 });
    }
    const fileBuffer = await fs.readFile(meta.filepath);
    const baseName = path.basename(meta.filepath);

    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(baseName)}"`);

    return new Response(new Uint8Array(fileBuffer), { status: 200, headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка при скачивании файла" }, { status: 500 });
  }
}
