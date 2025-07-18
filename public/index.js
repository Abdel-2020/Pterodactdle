const userGuessForm = document.getElementById("userGuessForm");
const input = document.getElementById("autocomplete-input");
const submitBtn = document.getElementById("autocomplete-submit");

const resultsContainer = document.querySelector(".results-container");
const timer = document.createElement("h2");

let lastGuess = "";

//Autocomplete
function autocomplete(inp, arr) {
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

async function sendGuessToServer(string) {
  if (lastGuess == string) {
    console.log("lastGuess = string")
  } else {
    await axios
      .post(
        "/api/v1/dinos/userGuess", {
          name: string
        }, {
          withCredentials: true
        },
      )
      .then((res) => {
        prependElement(resultsContainer, parseResponse(res.data.html));
        if (res.data.answer) {
          endGame(res.data.attempts, res.data.nextRound);
        }
      })
      .catch((error) => {
        return error.message;
      });
  }
  lastGuess = string;
}

function parseResponse(htmlString) {
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, "text/html");
  return html;
}

function prependElement(container, html) {
  container.prepend(...html.getElementsByTagName('div'));
}



// Update the html with end game msg
function endGame(attemptCount, nextRound) {
  const appSubtitle = document.getElementById("app-subtitle");
  input.setAttribute("type", "hidden");
  submitBtn.setAttribute("type", "hidden");


  if (attemptCount > 1) {
    appSubtitle.innerText = `Well Done! It took you ${attemptCount} guesses!\n Next Round is in: `;
  } else {
    appSubtitle.innerText = `Well Done! It took you ${attemptCount} guess!\n Next Round is in: `;
  }

  parseTime(nextRound);
  setInterval(() => {
    nextRound -= 1000;
    parseTime(nextRound);
  }, 1000)

  appSubtitle.append(timer);
}


function parseTime(timeInMs) {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  timer.innerHTML = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
}

window.addEventListener("DOMContentLoaded", async () => {

  await axios
    .get("api/v1/dinos/", {
      withCredentials: true
    })
    .then((res) => {
      let dinosaurList = res.data;
      console.log(dinosaurList.data)
      autocomplete(document.getElementById("autocomplete-input"), dinosaurList.data)
    })

  await axios
    .get("api/v1/dinos/session", {
      withCredentials: true
    })
    .then((res) => {
      for (let i = 0; i < res.data.rows.length; i++) {
        prependElement(resultsContainer, parseResponse(res.data.rows[i]));
      }
      if (res.data.endGame) {
        endGame(res.data.attempts, res.data.nextRound);
      }

    })
    .catch((error) => {
      return error.message;
    })
});


//Trigger sendToServer if user hits enter or submits the form.
//Remove whatever the user guessed from the dinosaur array.
userGuessForm.addEventListener("keydown", (e) => {

  if (e.code == "Enter") {
    e.preventDefault();
    if (input.value) {
      sendGuessToServer(input.value);
      input.value = "";
    }
  }
});

userGuessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    sendGuessToServer(input.value);
  }
  input.value = "";
});