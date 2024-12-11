const User = require("../config/models/AllStudents");

module.exports = {
  getReport: async (req, res) => {
    const { email } = req.params;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      return res.status(200).json({ status: true, data: user.report });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Server error", error });
    }
  },
  postReport: async (req, res) => {
    const { email } = req.params;
    const { responseSheet } = req.body;
    if (!responseSheet) {
      return res
        .status(400)
        .send({ status: false, message: "Github Repo are required" });
    }
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { report: responseSheet },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .send({ status: false, message: "User not found" });
      }
      res
        .status(200)
        .send({ status: false, message: "Report submitted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Error posting report" });
    }
  },
};
