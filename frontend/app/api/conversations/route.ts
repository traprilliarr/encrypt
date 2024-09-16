import getCurrentUser from "@/app/actions/getCurrentUser";
import { addChatService } from "@/app/services/addChat";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId } = body;

    const members = [userId, currentUser?.id];
    const newConversation = await addChatService(
      currentUser?.backend_token,
      members
    );

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
