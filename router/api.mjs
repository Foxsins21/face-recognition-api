import express from "express";
const api = express();

import AttendanceController from "../app/controller/AttendanceController.mjs";

api.get("/v1/attendance/list", AttendanceController.list);
api.get("/v1/teacher/list", AttendanceController.index);
api.post("/v1/teacher/add", AttendanceController.store);
api.delete("/v1/teacher/delete/:id", AttendanceController.destroy);
api.post("/v1/take/in", AttendanceController.entry);
api.post("/v1/take/out", AttendanceController.exit);
api.get("/v1/recapitulation", AttendanceController.summary);

export default api;
