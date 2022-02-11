const express = require("express");
const router = express.Router();

module.exports = (db, io) => {

  // io.on('connection', function (socket) {
  //   console.log('connected!');
  // })

  router.get("/", (req, res) => {
    // req.io.emit("message", "hi")
    res.json({username: "hi"})
  });
  return router;
};
