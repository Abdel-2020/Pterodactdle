const {
  getResult
} = require("../logic/result");
const {
  timeLeft
} = require("../logic/countdown");
const sessionServices = require("../services/sessionService")

exports.getTime = async () => {
  return timeLeft();
};

exports.handleGuess = async (userGuess, dotd, sessionID) => {
  try {
    //creates and returns an empty session if none are found.
    let checkSession = await sessionServices.getPlayerState(sessionID);
    console.log("checking session: ")
    console.log(checkSession);
    console.log("________________________")

    //Return session if session is valid
    if (checkSession.correct) {
      console.log(`EndGame is true!`);
      console.log( `Returning:`)
      console.log(checkSession);
      console.log("________________________")

      return {
        html: checkSession.rows,
        correct: checkSession.correct,
        attempts: checkSession.attempts,
        nextRound: timeLeft()
      }
    }


    const result = getResult(userGuess, dotd);
    console.log("Evaluating Guess: ")
    console.log(result)
    console.log("________________________")

    //store the result in session!
    let session = await sessionServices.storePlayerState(sessionID, result.correct, result.html, result.guess);
    console.log("Storing the session: ")
    console.log(session)
    console.log("________________________")

    console.log("returning to controllers the following info........:")
    console.log(result.correct, result.html, session.attempts)

    return {
      correct: result.correct,
      html: result.html,
      attempts: session.attempts,
      nextRound: timeLeft()
    }
  } catch (error) {
    console.log(` error at handleGuess: ${error}`)
  }


}