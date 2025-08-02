import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const students = await User.find({ role: "STUDENT" });
  return new Response(JSON.stringify(students), { status: 200 });
}
