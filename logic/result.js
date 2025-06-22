const result = (userGuessDino, dotd) => {
  //Create the results matrix
  let arr = [];

  for (key in dotd) {
    if (dotd.hasOwnProperty(key)) {
      if (userGuessDino[key] == dotd[key]) {
        arr.push( `<div class="square green-square"></div>`);
      } else if (typeof userGuessDino[key] == "number") {
        userGuessDino[key] < dotd[key] ? (arr.push( `<div class="square amber-square"></div>`)) : (arr.push( `<div class="square amber-square"></div>`));
      } else {
        arr.push( `<div class="square red-square"></div>`);
      }
    }
  }
  let row = "";
  row = row.concat('<div class="result-array">',...arr, '</div>');
  return row;
};

module.exports = { result };
