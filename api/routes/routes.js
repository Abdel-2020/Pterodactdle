const express = require("express");
const router = express.Router();
const {
  //populateDB,
  getAllDinos,
  getDino,
  randomDoc,
  createDino,
  editDino,
  removeDino,
  manageSession,
  userGuess,
  getStats,
  getHint,
  resetGameState 
} = require("../controllers/controllers");
//router.route("/populate").post(populateDB)
router.route("/").get(getAllDinos);
router.route("/createDino").post(createDino);
router.route("/userGuess/:id").post(userGuess);
router.route("/stats").get(getStats);
router.route("/session").get(manageSession);
router.route("/getDino/:id").get(getDino);
router.route("/getRandom").get(randomDoc);
router.route("/updateDino/:id").put(editDino);
router.route("/getHint").get(getHint);
router.route("/deleteDino/:id").delete(removeDino);
router.route("/reset").get(resetGameState);


//Export Router to app.js
module.exports = router;
