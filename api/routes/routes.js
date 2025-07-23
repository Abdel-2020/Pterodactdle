const express = require("express");
const router = express.Router();
const {
  populateDB,
  getAllDinos,
  getDino,
  createDino,
  editDino,
  removeDino,
  manageSession,
  userGuess,
} = require("../controllers/controllers");
router.route("/populate").post(populateDB)
router.route("/").get(getAllDinos).post(createDino);
router.route("/userGuess").post(userGuess);
router.route("/session").get(manageSession)
router.route("/:id").get(getDino).patch(editDino).delete(removeDino);

//Export Router to app.js
module.exports = router;