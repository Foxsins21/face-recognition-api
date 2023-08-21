import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import router from "./router/api.mjs";
import moment from 'moment-timezone'
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3030;

moment.tz.setDefault("Asia/Jakarta");
moment.locale("id");
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
    limit: "50mb",
  })
);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
