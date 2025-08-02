import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // important for sorting by createdAt
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
