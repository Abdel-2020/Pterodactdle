const {
  getResult
} = require("../logic/result");
const {
  timeLeft
} = require("../logic/countdown");
const sessionServices = require("../services/sessionService");

exports.getTime = async () => {
  return timeLeft();
};

exports.handleGuess = async (userGuess, dotd, sessionId) => {
  try {
 console.log("Guess Service - Checking Session: ")
  const Session =  await sessionServices.getPlayerState(sessionId);
  const {session} = Session;
  
  
    if (session.end_game) {
      console.log(`EndGame is true!`);
      console.log(`Returning:`)
      console.log(session);
      console.log("________________________")

      return {
        session,
        nextRound: timeLeft()
      }
    }

    console.log("Evaluating Guess....")
    const result = getResult(userGuess, dotd);

    const {tiles} = result;
  
    await sessionServices.storeGuess(sessionId, tiles);
    
    session.attempts++;
  
    if(result.correct){
      session.streak++;
    }

    //store the result in session!

     await sessionServices.updatePlayerState(sessionId, result.correct, session.attempts, session.streak);

     
    console.log('returning evaluated guess object.....')
    console.log("________________________")
    
    return {
      result,
      attempts: session.attempts,
      streak: session.streak,
      nextRound:  timeLeft()
    }

  } catch (error) {
    return error;
  }
}
