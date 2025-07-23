const PlayerState = require("../models/playerState")
const {timeLeft} = require("../logic/countdown");



exports.resetSession = async  () => {
  try {
    await PlayerState.updateMany({}, {
      numberOfAttempts: 0,
      endGame: false,
      rows: [],
      guesses: []
    }, {});

  } catch (error) {
    return error.message;
  }

}


exports.storePlayerState = async (playerSessionID, endGame, rows, guesses) =>  {
  try {
    return await PlayerState.findOneAndUpdate({
      playerSessionID,
    }, {
      $setOnInsert: {
        playerSessionID,
      },
      $set: {
        endGame: endGame,
        
      },
      $inc: {
        numberOfAttempts: 1
      },
      $push: {
        rows: rows,
        guesses: guesses
      }
    }, {
      upsert: true,
      new: true
    });
  } catch (error) {
    return res.status(500).json(error.message)
  };
}


exports.getPlayerState = async(sessionId) => {
  let playerState = await PlayerState.findOne({
        playerSessionID: sessionId
      });
    
    if(!playerState){
          playerState = await PlayerState.create({
          playerSessionID: sessionId,
          endGame:false,
          numberOfAttempts:0,
          rows:[],
          guesses:[]
        })
        playerState = playerState.toJSON();
    }
  
 
  return {
     endGame: playerState.endGame ,
     attempts: playerState.numberOfAttempts ,
     rows: playerState.rows ,
     guesses: playerState.guesses,
     nextRound: timeLeft()
  }  
}