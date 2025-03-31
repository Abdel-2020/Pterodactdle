const dinoArray = axios
  .get("/api/v1/dinos")
  .then((res) => {
    const {
      data
    } = res;
    return data;
  })
  .catch((error) => {
    console.log(error);
  });

  



let userGuessForm = document.getElementById("userGuessForm");
userGuessForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userGuess = document.getElementById("autocomplete-input").value;

  axios.post("/api/v1/dinos/userguess", {
      "name": userGuess
    })
    .then((res) => {
      console.log(res.data.answer);
    })
    .catch((error) => {
      console.log(error.response.data.msg);
    });

  //console.log(`userguess: ${userGuess}`);
});



/* Working code
function 
*/

