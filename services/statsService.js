const PlayerState = require("../models/playerState")

exports.getDailyCorrect = async () => {
    try{
        let count =  await PlayerState.countDocuments({"endGame":true});
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
}