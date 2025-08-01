import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";

export async function PATCH(req, { params }) {
  await connectDB();
  const { status, feedback } = await req.json();
  const updated = await Submission.findByIdAndUpdate(
    params.id,
    { status, feedback },
    { new: true }
  );
  return new Response(JSON.stringify(updated), { status: 200 });
}
