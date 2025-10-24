import { NextResponse } from "next/server";
import { cleanup } from "../../utils/cleenup";

export async function POST() {
  try {
    await cleanup();
    return NextResponse.json({ 
      message: "Очистка завершена",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Ошибка при очистке:", error);
    return NextResponse.json(
      { error: "Ошибка при очистке файлов" }, 
      { status: 500 }
    );
  }
}
