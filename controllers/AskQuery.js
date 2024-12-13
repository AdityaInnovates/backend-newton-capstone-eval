module.exports = {
  getQuery: async (req, res) => {
    const Query = require("../config/models/studentFeedback");
    try {
      const query = req.query?.id
        ? await Query.findOne({ _id: req.query.id })
        : await Query.find({});
      if (!query) {
        return res.status(500).send({ status: true, msg: [] });
      }
      return res.status(200).send({ status: true, msg: query });
    } catch (err) {
      return res.status(500).send("Error getting Query");
    }
  },

  postQuery: async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).send("Query is required");
    }
    const Query = require("../config/models/studentFeedback");
    try {
      const newQuery = new Query({ query });
      await newQuery.save();
      res.status(200).send("Query submitted successfully");
    } catch (err) {
      return res.status(500).send("Error posting Query");
    }
  },

  putQuery: async (req, res) => {
    const { feedback, id } = req.body;
    if (!feedback) {
      return res.status(400).send("feedback is required");
    }
    const Query = require("../config/models/studentFeedback");
    try {
      const updatedQuery = await Query.findByIdAndUpdate(
        id,
        { feedback },
        { new: true }
      );
      if (!updatedQuery) {
        return res.status(404).send("Query not found");
      }
      res.status(200).send("Query updated successfully");
    } catch (err) {
      return res.status(500).send("Error updating Query");
    }
  },
};
