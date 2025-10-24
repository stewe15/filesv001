import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function cleanup() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);

    for (const file of files) {
      if (file.endsWith(".json")) {
        const metaPath = path.join(UPLOAD_DIR, file);
        const meta = JSON.parse(await fs.readFile(metaPath, "utf8")) as {
          expiresAt: number;
        };

        const dataFile = metaPath.replace(".json", "");

        if (Date.now() > meta.expiresAt) {
          await fs.unlink(metaPath);
          await fs.unlink(dataFile).catch(() => {});
          console.log(`🗑 Удалено: ${dataFile}`);
        }
      }
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Ошибка при очистке:", err);
    }
  }
}
