const result = (userGuessDino, dotd) => {
  //answer object will store correct/incorrect matches
  answer = {};
  console.log(`(Inside Result) User Guess ${JSON.stringify(userGuessDino)}`);
  console.log(`(Inside Result) DOTD: ${JSON.stringify(dotd)}`);

  //Compare DOTD with User's guess:
  //Iterate through the DOTD object.
  //Check if key exists within DOTD
  //Validating the user's guess against the DOTD:

  //"2" = correct guess,
  //"+/-1" = incorrect with hint (greater or less than),
  //"0" incorrect guess

  for (key in dotd) {
    if (dotd.hasOwnProperty(key)) {
      if (userGuessDino[key] == dotd[key]) {
        answer[key] = 2;
      } else if (typeof userGuessDino[key] == "number") {
        userGuessDino[key] < dotd[key] ? (answer[key] = -1) : (answer[key] = 1);
      } else {
        answer[key] = 0;
      }
    }
  }
  console.log(`(Inside Result) Answer: ${JSON.stringify(answer)}`);
  return answer;
};

module.exports = {result};