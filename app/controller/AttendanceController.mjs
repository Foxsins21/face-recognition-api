import Attendance from "../models/mongo/Attendance.mjs";
import User from "../models/mongo/User.mjs";
import { Validator } from "node-input-validator";
import { errorValidations } from "../helpers/index.mjs";
import date from "date-and-time";
import moment from "moment";

const AttendanceController = {
  async index(req, res) {
    try {
      const users = await User.find({});
      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: users,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async list(req, res) {
    try {
      const response = [];
      const attendances = await Attendance.find({ date: { $gte: new Date(req.query.start_date).toISOString(), $lte: new Date(req.query.end_date).toISOString() } });
      for (const attendance of attendances) {
        let users = await User.find({ _id: attendance.userId });
        let data = {
          _id: attendance.userId,
          attendance_id: attendance._id,
          date: attendance.date,
          entryTime: attendance.entryTime,
          exitTime: attendance.exitTime,
          name: users[0].name,
          mapel: users[0].mapel,
          image: users[0].image,
          no_induk: users[0].no_induk,
          kodemapel: users[0].kodemapel,
          mood: users[0].mood,
        };
        response.push(data);
      }
      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: response,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async entry(req, res) {
    try {
      const validate = new Validator(req.body, {
        user_id: "required|string",
      });
      const matched = await validate.check();
      if (!matched)
        return res.status(400).send({
          status: false,
          error: true,
          message: errorValidations(validate.errors),
          data: null,
        });
        const user = await User.find({ "_id": req.body.user_id });
      let paramUser = {
        "kodemapel": user[0].kodemapel,
        "mapel": user[0].mapel,
        "no_induk": user[0].no_induk,
        "name": user[0].name,
        "mood": user[0].mood
      };

      const entry = await Attendance.find({ userId: req.body.user_id, date: { $gte: new Date(date.format(new Date(), "YYYY-MM-DD")).toISOString(), $lte: new Date(date.format(new Date(), "YYYY-MM-DD")).toISOString() } });
      if (entry.length)
        return res.status(400).send({
          status: false,
          error: true,
          message: "Absen masuk sudah dilakukan",
          data: null,
        });

      let isLate = 0;
      let entryTime = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
      let late = date.format(new Date(), "YYYY-MM-DD 08:00:00");

      if (entryTime > late) {
        isLate = 1;
      }

      const attendance = await new Attendance({
        userId: req.body.user_id,
        entryTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        date: date.format(new Date(), "YYYY-MM-DD"),
        user: JSON.stringify(paramUser),
        late: isLate,
      });
      attendance.save();

      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: attendance,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async exit(req, res) {
    try {
      const validate = new Validator(req.body, {
        user_id: "required|string",
        date: "required|string",
      });
      const matched = await validate.check();
      if (!matched)
        return res.status(400).send({
          status: false,
          error: true,
          message: errorValidations(validate.errors),
          data: null,
        });

      const attendance = await Attendance.findOne({
        userId: req.body.user_id,
        date: { $gte: new Date(date.format(new Date(req.body.date), "YYYY-MM-DD")).toISOString(), $lte: new Date(date.format(new Date(req.body.date), "YYYY-MM-DD")).toISOString() },
      });
      if (!attendance)
        return res.status(404).send({
          status: false,
          error: true,
          message: "Data tidak ditemukan",
          data: null,
        });

      if (attendance.exitTime)
        return res.status(400).send({
          status: false,
          error: true,
          message: "Absen keluar sudah dilakukan",
          data: attendance,
        });

      const params = {
        exitTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      const result = await Attendance.findByIdAndUpdate(attendance._id, { $set: params }, { upsert: true });
      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async store(req, res) {
    try {
      const validate = new Validator(req.body, {
        kodemapel: "required|string",
        mapel: "required|string",
        no_induk: "required|string",
        name: "required|string",
        image: "required|string",
        mood: "required|string",
      });

      const matched = await validate.check();
      if (!matched)
        return res.status(400).send({
          status: false,
          error: true,
          message: errorValidations(validate.errors),
          data: null,
        });

      const user = await new User({
        kodemapel: req.body.kodemapel,
        mapel: req.body.mapel,
        no_induk: req.body.no_induk,
        name: req.body.name,
        image: req.body.image,
        mood: req.body.mood,
      });
      user.save();

      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async destroy(req, res) {
    try {
      await User.deleteOne({ _id: req.params.id });
      return res.status(200).send({
        status: true,
        error: false,
        message: "Teacher has deleted",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async summary(req, res) {
    try {
      const response = [];
      const start_date = new Date(req.query.month + "-01").toISOString();
      const end_date = new Date(req.query.month + "-30").toISOString();
      let days = moment(req.query.month, "YYYY-MM").daysInMonth();
      let sum = 0;
      for (let i = 1; i <= days; i++) {
        let getDay = new Date(req.query.month + "-" + i).getDay();
        if ([1, 2, 3, 4, 5, 6].includes(getDay)) {
          sum++;
        }
      }

      const users = await User.find({});
      for (const user of users) {
        const summary = await Attendance.aggregate([
          {
            $match: {
              entryTime: { $gt: start_date, $lt: end_date },
              userId: user._id,
            },
          },
          {
            $group: {
              _id: "$userId",
              total: { $sum: 1 },
            },
          },
        ]);
        const late = await Attendance.aggregate([
          {
            $match: {
              entryTime: { $gt: start_date, $lt: end_date },
              userId: user.id,
              late: 1,
            },
          },
          {
            $group: {
              _id: "$userId",
              total: { $sum: 1 },
            },
          },
        ]);
        let total = 0;
        let isLate = 0;
        if(late[0]){
          isLate = late[0].total;
        }
        if (summary[0]) {
          total = summary[0].total;
        }
        let absen = {
          no_induk: user.no_induk,
          kodemapel: user.kodemapel,
          mapel: user.mapel,
          name: user.name,
          image: user.image,
          mood: user.mood,
          total: total + "/" + sum,
          late : isLate
        };
        response.push(absen);
      }

      return res.status(200).send({
        status: true,
        error: false,
        message: "Successfully",
        data: response,
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },
};

export default AttendanceController;
