const result = (userGuessDino, dotd) => {
  //answer object will store correct/incorrect matches
  answer = {};

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
  return answer;
};

module.exports = { result };
