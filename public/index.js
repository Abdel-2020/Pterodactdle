//Get list of objects in DB
/*
function getArrayFromDb() {
  return axios
    .get("/api/v1/dinos/getList")
    .then((res) => {
      return res.data})
    .catch((error) => {
      console.log(error);
      return []; // return an empty array if error occurs
    });
}
async function loadDinos (){
let dinos = await getArrayFromDb();
return dinos;
} 

let dinosaurs = loadDinos()
.then((res) => {
 
})
.catch((error) => {
  console.log(error);
});
*/



let dinosaurs = [
  "Spinosaurus",
  "Tyrannosaurus Rex",
  "Velociraptor",
  "Allosaurus",
  "Spinosaurus",
  "Carnotaurus",
  "Baryonyx",
  "Giganotosaurus",
  "Deinonychus",
  "Megalosaurus",
  "Therizinosaurus",
  "Brachiosaurus",
  "Apatosaurus",
  "Diplodocus",
  "Camarasaurus",
  "Argentinosaurus",
  "Triceratops",
  "Pachycephalosaurus",
  "Styracosaurus",
  "Torosaurus",
  "Stegosaurus",
  "Ankylosaurus",
  "Edmontonia",
  "Gigantspinosaurus",
  "Iguanodon",
  "Parasaurolophus",
  "Edmontosaurus",
  "Corythosaurus",
  "Maiasaura",
];

let userGuessForm = document.getElementById("userGuessForm");
let submitBtn = document.getElementById("autocomplete-submit");
let input = document.getElementById("autocomplete-input");

//Self explanatory
function sendToServer(string) {
  axios
    .post(
      "/api/v1/dinos/userGuess",
      {
        name: string,
      },
      { withCredenitals: true },
    )
    .then((res) => {
      //console.log(res.data);
      answerMatrix(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Trigger sendToServer if user hits enter or submits the form.
//Remove whatever the user guessed from the dinosaur array.
userGuessForm.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    if (input.value) {
      sendToServer(input.value);
      dinosaurs = dinosaurs.filter((item) => item !== input.value);
      autocomplete(document.getElementById("autocomplete-input"), dinosaurs);
    }

    //reset the input value to blank for better UX
    input.value = "";
  }
});

userGuessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    sendToServer(input.value);
    dinosaurs = dinosaurs.filter((item) => item !== input.value);
    autocomplete(document.getElementById("autocomplete-input"), dinosaurs);
  }
  input.value = "";
});

//Autocomplete
let autocomplete = (inp, arr) => {
  //currentFocus will keep track of which item in the list is in focus
  let currentFocus;
  //execute function on input
  inp.addEventListener("input", (e) => {
    //close any open lists
    closeAllLists();

    //create list, item, value
    let list;
    let item;
    let value = inp.value;

    currentFocus = -1;
    if (!value) {
      return false;
    }

    //build list div
    list = document.createElement("div");
    list.setAttribute("id", "autocomplete-list");
    list.setAttribute("class", "autocomplete-items");

    //set list as a child of the container.
    inp.parentNode.appendChild(list);

    //For each item in our array, check if the item starts with the same letters as the text field value

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
        //create a div for each matching item
        item = document.createElement("div");
        item.setAttribute("class", "list-item");
        item.innerHTML = `<strong>${arr[i].substr(0, value.length)}</strong> `;
        item.innerHTML += arr[i].substr(value.length);

        //Create a hidden input field to hold the array item's value
        item.innerHTML += `<input type="hidden"  value = "${arr[i]}">`;
        //Execute function when item is clicked.

        item.addEventListener("click", (e) => {
          //insert the value from the autocomplete field
          inp.value = e.target.getElementsByTagName("input")[0].value;

          //close the list
          closeAllLists();
        });
        list.appendChild(item);
      }
    }
  });

  inp.addEventListener("keydown", (e) => {
    let list = document.getElementById("autocomplete-list");

    if (list) {
      item = list.getElementsByClassName("list-item");
    }
    if (e.code == "ArrowDown") {
      //If down key is pressed, increase the counter.
      //Make the current item more visible
      currentFocus++;
      addActive(item);
    } else if (e.code == "ArrowUp") {
      currentFocus--;
      addActive(item);
    } else if (e.code == "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        if (item) {
          item[currentFocus].click();
        }
      }
    }
  });

  let addActive = (item) => {
    if (!item) {
      return false;
    }
    //start by removing active class on all items.
    removeActive(item);
    //console.log(`currentFocus: ${currentFocus}`)
    //console.log(`Item.length: ${item.length}`)
    if (currentFocus >= item.length) {
      currentFocus = 0;
    }
    if (currentFocus < 0) {
      currentFocus = item.length - 1;
    }

    item[currentFocus].classList.add("autocomplete-active");
  };

  let removeActive = (item) => {
    for (let i = 0; i < item.length; i++) {
      item[i].classList.remove("autocomplete-active");
    }
  };

  let closeAllLists = (elmnt) => {
    //Close all lists in the document, except the one that has been passed

    let list = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < list.length; i++) {
      if (elmnt != list[i] && elmnt != inp) {
        list[i].parentNode.removeChild(list[i]);
      }
    }
  };

  document.addEventListener("click", (e) => {
    closeAllLists(e.target);
  });
};

/* Answer Matrix & Calculating Win Condition*/

function isCorrect(answerObject) {
  return Object.values(answerObject).every((value) => value === 2);
}

//Stop player from entering inputs by hiding the input and submit fields.
function endGame() {
  let appSubtitle = document.getElementById("app-subtitle");
  input.setAttribute("type", "hidden");
  submitBtn.setAttribute("type", "hidden");
  appSubtitle.innerText = "Well Done! Try again Tomorrow.";
}

//This function builds the answer according to the values in answer object.
function answerMatrix(answerObject) {
  const resultsContainer = document.querySelector(".results-container");

  //Create Row Element
  const resultsArray = document.createElement("div");
  resultsArray.setAttribute("class", "result-array");

  //Generate a line of squares each indicating if the attribute is:
  //Correct (green)
  //Partially Correct (Amber)
  //Incorrect (Red)

  for (key in answerObject) {
    //Create the squares

    const greenSquare = document.createElement("div");
    const amberSquare = document.createElement("div");
    const redSquare = document.createElement("div");

    greenSquare.setAttribute("class", "square green-square");
    amberSquare.setAttribute("class", "square amber-square");
    redSquare.setAttribute("class", "square red-square");

    if (answerObject.hasOwnProperty(key)) {
      if (answerObject[key] == 2) {
        resultsArray.append(greenSquare);
      } else if (answerObject[key] == 1 || answerObject[key] == -1) {
        resultsArray.append(amberSquare);
      } else {
        resultsArray.append(redSquare);
      }
    }
  }
  resultsContainer.prepend(resultsArray);

  //Check if the answer is correct, if so end the game.
  if (isCorrect(answerObject)) {
    endGame();
  }
}

autocomplete(document.getElementById("autocomplete-input"), dinosaurs);

