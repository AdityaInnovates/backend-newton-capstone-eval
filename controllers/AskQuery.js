module.exports = {
  getQuery: (req, res) => {
    const Query = require("../config/models/studentFeedback");
    Query.findById(req.params.id, (err, query) => {
      if (err) {
        return res.status(500).send("Error finding Query");
      }
      if (!query) {
        return res.status(404).send("Query not found");
      }
      res.status(200).send(query);
    });
  },
  postQuery: (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).send("Query is required");
    }
    const Query = require("../config/models/studentFeedback");
    const newQuery = new Query({ query });
    newQuery.save((err, query) => {
      if (err) {
        return res.status(500).send("Error posting Query");
      }
      res.status(200).send("Query submitted successfully");
    });
  },
  putQuery: (req, res) => {
    const { feedback } = req.body;
    if (!query) {
      return res.status(400).send("Query is required");
    }
    const Query = require("../config/models/studentFeedback");
    Query.findByIdAndUpdate(
      req.params.id,
      { feedback },
      { new: true },
      (err, updatedQuery) => {
        if (err) {
          return res.status(500).send("Error updating Query");
        }
        if (!updatedQuery) {
          return res.status(404).send("Query not found");
        }
        res.status(200).send("Query updated successfully");
      }
    );
  },
};
