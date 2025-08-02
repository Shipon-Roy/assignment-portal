import { connectDB } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const updated = await Assignment.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update assignment" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete assignment" }),
      { status: 500 }
    );
  }
}
