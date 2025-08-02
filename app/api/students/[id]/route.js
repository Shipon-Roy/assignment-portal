import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  await User.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Student deleted" }), {
    status: 200,
  });
}
