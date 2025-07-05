const answerObj = (userGuessDino, dotd) => {
  //Create the results matrix by comparing values between objects and assign a square.
  let arr = [];
  let html = "";

  for (key in dotd) {
    if (dotd.hasOwnProperty(key)) {
      if (userGuessDino[key] == dotd[key]) {
        arr.push(`<div class="square green-square"><p class="attribute-text">${userGuessDino[key]}</p></div>`);
      } else if (typeof userGuessDino[key] == "number") {
        userGuessDino[key] < dotd[key] ? (arr.push(`<div class="square amber-square"><img class="up-arrow" src="./images/arrow-svgrepo-com.svg" alt=""><p>${userGuessDino[key]}</p></div>`)) 
        : (arr.push(`<div class="square amber-square"><img class="down-arrow" src="./images/arrow-svgrepo-com.svg" alt=""><p>${userGuessDino[key]}</p></div>`));
      } else {
        arr.push(`<div class="square red-square"><p class="attribute-text">${userGuessDino[key]}</p></div>`);
      }
    }
  }

  //Check if all values are correct (green-square)
  function isCorrect (arr) {
    const isGreen = (elmnt) => elmnt.includes(`green-square`);
    if (arr){
          return arr.every(isGreen);
    }
  }
  
  //return object
  return {correct: isCorrect(arr), html:arr};

}


module.exports = {
  answerObj,
};