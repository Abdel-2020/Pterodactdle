const userGuessForm = document.getElementById("userGuessForm");
const resultsGrid = document.getElementsByClassName("results-section");


//Get list of objects in DB
const dinoArray = axios
  .get("/api/v1/dinos")
  .then((res) => {
    const { data } = res;
    console.log(JSON.stringify(data));
    return data;
  })
  .catch((error) => {
    console.log(error);
  });




userGuessForm.addEventListener("submit", (e) => {
  let answer = null; 
  e.preventDefault();

  const userGuess = document.getElementById("autocomplete-input").value;
  axios
    .post("/api/v1/dinos/userguess", {
      name: userGuess,
    })
    .then((res) => {
      displayGrid(res.data);
  
    
    })
    .catch((error) => {
      console.log(error.response.data.msg);
    });
  

    

});

/* Autocomplete
*/


/* Answers
*/

let displayGrid = (answerObject) => {

//Generate a line of squares each indicating if the attribute is:
//Correct (green)
//Partially Correct (Amber)
//Incorrect (Red)
const resultsSection = document.querySelector(".results-section");
const div = document.createElement('div');
div.setAttribute("class", "result-array");
resultsArray = resultsSection.appendChild(div);


  for(key in answerObject){
    
    if (answerObject.hasOwnProperty(key)){
      const value = answerObject[key];
      if (value == 2){
        resultsArray.innerHTML  +=  '<div class="square green-square"></div>'
      } else if (value == 0){
        resultsArray.innerHTML += '<div class="square red-square"></div>'
      } else if (value == 1 || value == -1){
        resultsArray.innerHTML   += '<div class="square amber-square"></div>'
      }
    }

}
}