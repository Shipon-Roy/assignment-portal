import { connectDB } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();
    // Get newest first
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch assignments",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, deadline, instructorId } = body;

    if (!title || !description || !deadline || !instructorId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const newAssignment = await Assignment.create({
      title,
      description,
      deadline,
      instructorId,
    });

    return new Response(JSON.stringify(newAssignment), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to create assignment",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
