import mongoose from "../../config/mongo.mjs";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    kodemapel: { type: String, required: true },
    mapel: { type: String, required: true },
    no_induk: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: null },
    mood: { type: String, required: true },
    status: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
