import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireRole(role) {
  const session = await getServerSession();
  if (!session || session.user.role !== role) {
    redirect("/login");
  }
}
