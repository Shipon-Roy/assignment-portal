import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const count = await User.countDocuments({ role: "STUDENT" });
    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), {
      status: 500,
    });
  }
}
