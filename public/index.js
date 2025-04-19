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

const userGuessForm = document.getElementById("userGuessForm");
userGuessForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userGuess = document.getElementById("autocomplete-input").value;
  axios
    .post("/api/v1/dinos/userguess", {
      name: userGuess,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error.response.data.msg);
    });
});

/* Working code
function 
*/
