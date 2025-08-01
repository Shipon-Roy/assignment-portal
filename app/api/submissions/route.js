import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";

export async function GET() {
  await connectDB();
  const submissions = await Submission.find()
    .populate("studentId", "name")
    .populate("assignmentId", "title");
  return new Response(JSON.stringify(submissions), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { submissionUrl, note, studentId, assignmentId } = await req.json();
  const sub = await Submission.create({
    submissionUrl,
    note,
    studentId,
    assignmentId,
  });
  return new Response(JSON.stringify(sub), { status: 201 });
}
