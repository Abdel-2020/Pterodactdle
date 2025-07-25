const Dino = require("../../models/dinos")
const PlayerState = require("../../models/playerState")
const cron = require("node-cron");
const {timeLeft} = require("../../logic/countdown")
const services = require("../../services/services");
const sessionServices = require("../../services/sessionService");
const { json } = require("express");


/*
 * DB Management/API Calls
 *  Create Many
 *  Create One
 *  Read All
 *  Read One
 *  Read One Random
 *  Update One
 *  Delete One
 */

// Create Many
const populateDB = async (req, res) => {
  const data = req.body;
  try {
    const dinos = await Dino.insertMany(data);

    return res.status(200).json({
      msg: "success",
      data: data
    });
  } catch (error) {
    return res.status(404).json({
      msg: error.message
    });
  }
};


// Create One
const createDino = async (req, res) => {
  try {
    const dino = await Dino.create(req.body);
    return res.status(200).json({
      msg: "Success!",
      data: dino
    });
  } catch (error) {
    return res.status(400).json({
      msg: error
    });
  }
};

// Read All
const getAllDinos = async (req, res) => {

  try {
    const dinosaurList = await Dino.find({}, {
      _id: 0,
      period: 0,
      diet: 0,
      clade: 0,
      height: 0,
      weight: 0,
      __v: 0,
    }, ).lean(); // Second object passed to this function turns the response from a mongoose object to JSON. 

    const data= [];
    for(let i = 0; i < dinosaurList.length; i++){
      data[i] = dinosaurList[i].name;
    }

   
    return res.status(200).json({
      data
    });
  } catch (error) {
    return res.status(404).json({
      msg: error
    });
  }
};

// Read One
const getDino = async (req, res) => {
  try {
    //grab route parameter
    const {
      id
    } = req.params;

    // search the DB
    const dino = await Dino.findById(id);

    // check if dino exists
    if (!dino) {
      return res.status(404).json({
        msg: "Dinosaur not found"
      });
    }

    return res.status(200).json({
      msg: "Success!",
      data: {
        dino
      }
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};

// Update One
const editDino = async (req, res) => {
  try {
    // Grab route parameter
    const {
      id
    } = req.params;
    // Grab request body
    const data = req.body;

    const dino = await Dino.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    // Check if dino exists
    if (!dino) {
      return res.status(404).json({
        msg: "Dinosaur not found"
      });
    }

    return res.status(200).json({
      msg: "Dinosaur Updated!",
      data: {
        dino
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};

// Delete One
const removeDino = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const dino = await Dino.findByIdAndDelete(id);
    if (!dino) {
      return res.status(404).json({
        msg: "Dinosaur not found"
      });
    }
    return res.status(200).json({
      dino: dino,
      msg: "Removed from db"
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};


/*
 * Guessing logic
 *  randomDoc{} - Pulls random document from DB and stores it in dotd. Cron Job runs once a day.
 *  userGuess{} - Uses the clients input to retrieve a dinosaur from the DB and stores it in userGuessDino
 *  result{}    - Compare both objects and return an answer object (see below)
 *
 * */

let dotd = null;
let userGuessDino = null;


// Read One Random
const randomDoc = async () => {
  try {
    const randomDino = await Dino.aggregate([{
        $sample: {
          size: 1
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0
        }
      }, // OMITS THE ANNOYING _id and __v fields
    ]);

  
    dotd = {
      dino: randomDino[0],
    };
    return dotd;

  } catch (error) {
    return error.message;

  }
};


const userGuess = async (req, res) => {
  try {
    userGuessDino = await Dino.findOne(req.body, {
      _id: 0,
      __v: 0
    });
   
  
    const answer= await  services.handleGuess(userGuessDino,dotd.dino);

 
    let playerState = await sessionServices.storePlayerState(
      req.sessionID, 
      answer.correct, 
      answer.html, 
      userGuessDino.name);
    
  return res.status(200).json({
      html: answer.html,
      answer: answer.correct,
      attempts: playerState.numberOfAttempts,
      nextRound: await services.getTime()
    });

  } catch (error) {
    res.status(500).json({
      msg: error
    });
  }
};


/*
 *
 * Cron Job
 *  Resets users session. 
 *  Grabs a random dino from the DB at midnight.
 * 
 *
 */

randomDoc();

cron.schedule("0 0 * * *",  async () => {
  try {
    await services.resetSession();
    await randomDoc();
  } catch (error) {
    return error.message;
  }

});


/*
 * Sessions Management
 * 
 *  
 * 
 *
 * */



const manageSession = async (req, res) => {
  try {
    let data = await sessionServices.getPlayerState(req.sessionID);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}



// Export to Routes
module.exports = {
  populateDB,
  getAllDinos,
  getDino,
  createDino,
  editDino,
  removeDino,
  userGuess,
  manageSession
};

