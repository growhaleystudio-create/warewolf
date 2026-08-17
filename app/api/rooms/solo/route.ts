import { NextResponse } from "next/server";
import { createSoloGame } from "@/lib/roomStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playerName } = body;

    const { roomCode, hostPlayerId } = createSoloGame(playerName || "Pemain Utama");

    return NextResponse.json({
      success: true,
      roomCode,
      playerId: hostPlayerId,
    });
  } catch (error) {
    console.error("Error creating solo game:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat game solo" },
      { status: 500 }
    );
  }
}
