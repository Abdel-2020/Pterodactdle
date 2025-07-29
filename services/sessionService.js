const PlayerState = require("../models/playerState")
const {timeLeft} = require("../logic/countdown");



exports.resetPlayerState = async  () => {
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

exports.storePlayerState = async (playerSessionID, correct, html, guess) =>  {
  try {
    const playerState =  await PlayerState.findOneAndUpdate({
      playerSessionID,
    }, {
      $setOnInsert: {
        playerSessionID,
      },
      $set: {
        endGame: correct,
        
      },
      $inc: {
        numberOfAttempts: 1
      },
      $push: {
        rows: html,
        guesses: guess
      }
    }, {
      upsert: true,
      new: true
    });

    return {
      endGame: playerState.endGame,
      attempts: playerState.numberOfAttempts,
      rows: playerState.rows,
      guesses:  playerState.guesses
    };

  } catch (error) {
    console.log(` error at storePlayerState: ${error}`)
    return res.status(500).json(error.message)
  };
}

exports.getPlayerState = async(sessionId) => {
  try {
      let playerState = await PlayerState.findOne({
        playerSessionID: sessionId
      });
    
    if(!playerState){
      console.log("No session found, creating one now....")
          playerState = await PlayerState.create({
          playerSessionID: sessionId,
        })
        playerState = playerState.toJSON();
            console.log("Created Session: ")
           console.log(playerState);
         console.log("________________________")

    }

  return {
     correct: playerState.endGame ,
     attempts: playerState.numberOfAttempts ,
     rows: playerState.rows ,
     guesses: playerState.guesses,
     nextRound: timeLeft()
  }  
  } catch (error) {
    console.log(` error at getPlayerState: ${error}`)
  }

}