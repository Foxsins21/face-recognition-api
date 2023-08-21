import mongoose from "../../config/mongo.mjs";
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    entryTime: { type: String, default: null },
    late: { type: Number, default: 0 },
    exitTime: { type: String, default: null },
    date: { type: Date, default: null },
    user: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
