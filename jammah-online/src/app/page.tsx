import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { HomePageClient } from "@/components/home/HomePageClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <HomePageClient session={session} />;
}
