import { NextResponse } from "next/server";
import { addChatMessageToRoom } from "@/lib/roomStore";

export async function POST(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const body = await req.json();
    const { senderId, text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const success = addChatMessageToRoom(code, senderId, text);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
