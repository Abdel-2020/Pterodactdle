const getResult = (userGuessDino, dotd) => {
  
  let tiles = [];

  for(const key in dotd){
    if(!dotd.hasOwnProperty(key)) continue;

    let colour = "red";
    let arrowDirection = null;

    //check if attributes match and assign a new colour or arrow where applicable
    if(userGuessDino[key] === dotd[key]){
      colour = "green"
    } else if (typeof userGuessDino[key] === "number"){
      colour = "amber";
      arrowDirection =  userGuessDino[key] < dotd[key] ? "up" : "down";
    } 

    tiles.push({
      key,
      value: userGuessDino[key],
      colour,
      arrowDirection
    })

  }

  const isCorrect = tiles.every(tile => tile.colour === "green");
  
  return {
    correct: isCorrect,
    tiles,
    guess: userGuessDino.name
  };
}


module.exports = {
  getResult,
};