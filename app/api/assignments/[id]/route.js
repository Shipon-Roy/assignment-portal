import { connectDB } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

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

    return new Response(
      JSON.stringify({ message: "Assignment deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to delete assignment",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
