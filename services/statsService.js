const PlayerState = require("../models/playerState")

exports.countAllCorrectGuesses = async() =>{
    try {
        let test =  await PlayerState.countDocuments({endGame:true})
        console.log(test);
    } catch (error) {
        return error;
    }
}