import { NextResponse } from "next/server";
import { 
  startRoomGame, 
  dispatchActionToRoom, 
  updateRoomSettings, 
  getRoom,
  addBotPlayerToRoom
} from "@/lib/roomStore";

export async function POST(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const body = await req.json();
    const { type, payload, playerId } = body;

    const room = getRoom(code);
    if (!room) {
      return NextResponse.json(
        { success: false, error: "Ruangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (type === "ADD_BOT") {
      const success = addBotPlayerToRoom(code, playerId);
      return NextResponse.json({ success });
    }

    if (type === "START_GAME") {
      const success = startRoomGame(code, playerId);
      if (!success) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Hanya Host yang dapat memulai permainan, dan butuh minimal 5 pemain!" 
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    }

    if (type === "UPDATE_SETTINGS") {
      const { settings, selectedRoles } = payload || {};
      const success = updateRoomSettings(code, playerId, settings, selectedRoles);
      return NextResponse.json({ success });
    }

    // Generic game reducer action
    const action = { type, payload };
    const success = dispatchActionToRoom(code, action);

    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error executing room action:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses aksi game" },
      { status: 500 }
    );
  }
}
