import { NextResponse } from "next/server";
import { createRoom } from "@/lib/roomStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostName, settings, selectedRoles } = body;

    const { roomCode, hostPlayerId } = createRoom(
      hostName || "Host Desa",
      settings,
      selectedRoles
    );

    return NextResponse.json({
      success: true,
      roomCode,
      hostPlayerId,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat ruangan" },
      { status: 500 }
    );
  }
}
