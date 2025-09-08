import { pusher } from "@/lib/pusher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await req.text();
  const params = new URLSearchParams(data);
  const socketId = params.get("socket_id")!;
  const channel = params.get("channel_name")!;

  const userData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      image: session.user.image,
    },
  };

  const authResponse = pusher.authorizeChannel(socketId, channel, userData);
  return new Response(JSON.stringify(authResponse));
}
