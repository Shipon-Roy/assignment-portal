import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    submissionUrl: String,
    note: String,
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    feedback: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  },
  { timestamps: true }
);

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);
