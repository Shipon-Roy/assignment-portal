import { connectDB } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET() {
  await connectDB();
  const assignments = await Assignment.find().populate("instructorId", "name");
  return new Response(JSON.stringify(assignments), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { title, description, deadline, instructorId } = await req.json();
  const assignment = await Assignment.create({
    title,
    description,
    deadline,
    instructorId,
  });
  return new Response(JSON.stringify(assignment), { status: 201 });
}
