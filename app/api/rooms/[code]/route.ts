import { NextResponse } from "next/server";
import { getSanitizedRoomForPlayer } from "@/lib/roomStore";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId") || "";

    const roomData = getSanitizedRoomForPlayer(code, playerId);
    if (!roomData) {
      return NextResponse.json(
        { success: false, error: "Ruangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: roomData,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data ruangan" },
      { status: 500 }
    );
  }
}
