const express = require("express");
const router = express.Router();
const {
  getAllDinos,
  getDino,
  createDino,
  editDino,
  removeDino,
  userGuess,
  sessMgmt,
} = require("../controllers/controllers");

router.route("/").get(getAllDinos).post(createDino);
router.route("/sess").get(sessMgmt)
router.route("/userGuess").post(userGuess);
router.route("/:id").get(getDino).patch(editDino).delete(removeDino);

//Export Router to app.js
module.exports = router;
