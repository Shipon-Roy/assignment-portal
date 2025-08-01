import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: Date,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
