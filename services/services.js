const {getResult} = require("../logic/result");
const {timeLeft} = require("../logic/countdown");

exports.getTime = async () => {
      return timeLeft();
  };

exports.handleGuess = async (userGuess,dotd) => {
    return getResult(userGuess,dotd) ;
}

