import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb+srv://jefrisitorus22:32JVmdBiE2mfpeMu@cluster0.ofelo3o.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((res) => console.log("connection success to MongoDB"))
    .catch((err) => console.log(err));
} catch (error) {
  console.log(error);
}

export function decimalField() {
  return {
    default: 0,
    required: true,
    type: mongoose.Schema.Types.Decimal128,
    get: (v) => v.toString(),
  };
}
export default mongoose;
