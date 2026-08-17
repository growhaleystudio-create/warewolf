import { NextResponse } from "next/server";
import { joinRoom } from "@/lib/roomStore";

export async function POST(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const body = await req.json();
    const { playerName } = body;

    if (!playerName || !playerName.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama pemain tidak boleh kosong" },
        { status: 400 }
      );
    }

    const result = joinRoom(code, playerName);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      playerId: result.playerId,
      roomCode: code.toUpperCase().trim(),
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { success: false, error: "Gagal bergabung ke ruangan" },
      { status: 500 }
    );
  }
}
