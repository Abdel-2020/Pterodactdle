const Dino = require("../models/dinos")
const PlayerState = require("../models/playerState")
const cron = require("node-cron");
const {
  answerObj
} = require("../logic/result");



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
    const data = await Dino.find({}, {
      _id: 0,
      period: 0,
      diet: 0,
      clade: 0,
      height: 0,
      weight: 0,
      __v: 0
    }, ); // Second object passed to this function omits the _id and __v fields
    return res.status(200).json(data);
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
let dinoNum = 0;

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

    dinoNum++;
    dotd = {
      dino: randomDino[0],
      dinoNum: dinoNum
    };
    return dotd;

  } catch (error) {
    return error.message;
    });
  }
};



async function resetSession() {
  try {
    await PlayerState.updateMany({}, {
      attempts: 0,
      endGame: false,
      rows: []
    }, {});

  } catch (error) {
    return error.message;
  }

}



/*
 *
 * Cron Job
 *  Resets users session. 
 *  Grabs a random dino from the DB at midnight.
 * 
 *
 */

randomDoc();
resetSession();

cron.schedule("0 0 * * *", async () => {
  try {
    await resetSession();
    await randomDoc(req, res);
  } catch (error) {
   return error.message;
  }

});

async function storePlayerState(playerSessionID, endGame, rows, ) {
  try {
    // Instantiate Player Document On First Guess

    return await PlayerState.findOneAndUpdate({
      playerSessionID,
    }, {
      $setOnInsert: {
        playerSessionID,
      },
      $set: {
        endGame: endGame
      },
      $inc: {
        attempts: 1
      },
      $push: {
        rows: rows
      }
    }, {
      upsert: true,
      new: true
    });
  } catch (error) {
    return error.message
  };
}

   function timeLeft () {
      let now = new Date();
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0)
      midnight.setDate(midnight.getDate() + 1)
      let remainingTime =  midnight - now;
      return remainingTime;
    }

const userGuess = async (req, res) => {
  try {
    userGuessDino = await Dino.findOne(req.body, {
      _id: 0,
      __v: 0
    });

    const answer = answerObj(userGuessDino, dotd.dino);
    const sessionId = req.sessionID;
    const playerState = await storePlayerState(sessionId, answer.correct, answer.html);

 


    return res.status(200).json({
      html: answer.html,
      answer: answer.correct,
      attempts: playerState.attempts,
      nextRound:timeLeft()
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};


/*
 * Sessions Management
 * 
 *  
 * 
 *
 * */



const sessMgmt = async (req, res) => {
  try {
    const sessionID = req.sessionID
    const playerSession = await PlayerState.find({
      playerSessionID: sessionID
    });

    res.status(200).json({
      rows: playerSession[0].rows,
      endGame: playerSession[0].endGame,
      attempts: playerSession[0].attempts,
      nextRound:timeLeft()
    });
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
  sessMgmt
};