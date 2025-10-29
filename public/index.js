const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 30,
    scalar: 1.2,
    shapes: ["circle", "square"],
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  });

  confetti({
    ...defaults,
    particleCount: 20,
    scalar: 2,
    shapes: ["emoji"],
    shapeOptions: {
      emoji: {
        value: ["🦖", "🦕"],
      },
    },
  });
}



//CARDS

const instructionsCard = document.getElementById("instructions-card")
const instructionsCardBtn = document.getElementById("instructions-card-close");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card-close")) {
    const card = e.target.closest(".card");
    if (card) {
      card.style.display = "none";
    }
  }
})

const contactUsCard = document.getElementById("contact-us-card")
const contactUsBtn = document.getElementById("socials-contact-btn");

contactUsBtn.addEventListener("click", () => {
  contactUsCard.style.display = "flex";
})

const helpBtn = document.getElementById("app-body-help");

helpBtn.addEventListener("click", () => {
  instructionsCard.style.display = "flex";
});





//USER GUESS AND AUTOCOMPLETE
/*
function removeFromArray(elmnt, arr) {
  if (arr.includes(elmnt)) {
    arr.filter((elmnt) => {
      return !arr.includes(elmnt)
    })
  }
}*/

const userGuessForm = document.getElementById("user-guess-form");
const input = document.getElementById("user-guess-input");
const submitBtn = document.getElementById("user-guess-form-btn");

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
      } else {
        console.log("invalid input")
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

//Guess functionality
const resultsContainer = document.querySelector(".results-container");
let lastGuess = "";

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
    input.value = "";
  }

});

function renderTiles(tiles) {

  const grid = document.querySelector(".results-container");

  const row = document.createElement("div");
  row.setAttribute("class", "results-container-row");

  tiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = `square ${tile.colour}-square ${tile.key}`;

    const content = document.createElement('p');
    content.className = 'attribute-text';
    content.innerHTML = tile.value;

    div.appendChild(content);

    if (tile.arrowDirection) {
      const arrow = document.createElement('img');
      arrow.className = `${tile.arrowDirection}-arrow`;
      arrow.src = `./images/arrow-svgrepo-com.svg`;
      div.appendChild(arrow);
    }
    row.appendChild(div);
    grid.prepend(row);

  })
}


function displayHint(attempts) {
  const guessCount = 5;
  const remaining = guessCount - attempts;
  const message = remaining > 0 ? `Reveal hint after ${remaining} attempt(s)` : `Reveal hint`;
  console.log(remaining);
  console.log(message);

  const appBodySub = document.querySelector('.app-body-subtitle');
  let appHint = document.querySelector('.app-hint');

  if (appHint == null) {
    const p = document.createElement('p');
    p.className = 'app-hint';
    p.textContent = message;
    appBodySub.appendChild(p);
  } else {
    appHint.textContent = message;
  }

  appHint = document.querySelector('.app-hint');
  if (remaining <= 0) {
    appHint.style.cursor = "pointer";
    appHint.addEventListener('click', async (e) => {
      await axios
        .get(`/api/v1/dinos/getHint`)
        .then((res) => {
          appHint.textContent = res.data;
        })
        .catch((error) => {
          return error;
        })
    })
  }




  /*
  const message =  remaining > 0 ? 

  const appBodySub = document.querySelector('.app-body-subtitle');
  const appHint = document.querySelector('.app-hint');

  //Check if text is already being displayed
  if(!appHint){
    const p = document.createElement('p');
    p.className = 'app-hint';
    p.textContent = message;
    appBodySub.appendChild(p);
  } else if (remaining > 0){
    appHint.textContent =  message;
  }else if(remaining<=0){
    remaining = 0;
    appHint.textContent =  message;
    
  }

  */
}


//SEND GUESS TO SERVER

async function sendGuessToServer(string) {
  if (lastGuess == string) {
    console.log("Cannot resubmit the same guess");
  } else {
    console.log('Sending Guess....')
    await axios
      .post(
        `/api/v1/dinos/userGuess/${string}`, {
          name: string
        }, {
          withCredentials: true
        },
      )
      .then((res) => {
        console.log('Received Response....');

        const {
          answer
        } = res.data;
        const {
          desc
        } = res.data;
        /*
        
        */
        displayHint(answer.attempts);
        /*
        console.log(answer);
        console.log(desc);
        */

        let tiles = answer.result.tiles;

        //Cache in localStorage
        ((count, tiles, desc) => {
          let guessNo = JSON.stringify(count);
          console.log('Storing in local storage....')
          localStorage.setItem(guessNo, JSON.stringify({
            row: tiles,
            desc: desc
          }));
        })(answer.attempts, tiles, desc);

        //render the result
        renderTiles(tiles);
        //add description labels
        addLabel(desc);

        //Check if user has guessed correctly...
        if (answer.result.correct) {
          endGame(answer.attempts, answer.nextRound);
          displayStreak(answer.streak);
        }
      })
      .catch((error) => {
        console.log(error);
        return error.message;
      })
  }
  lastGuess = string;
}


function displayStreak(streak) {
  const appStreak = document.querySelector('.app-streak');

  if (appStreak) {
    appStreak.innerText = `Your Streak: ${streak}`;
    return;
  }

  const appHead = document.querySelector(".app-head");
  const p = document.createElement("p");
  p.classList.add("app-streak");

  p.innerText = `Your Streak: ${streak}`;
  appHead.append(p);

}

// Update the html with end game msg
function endGame(attemptCount, nextRound) {

  const appSubtitle = document.getElementById("app-body-subtitle");

  input.setAttribute("type", "hidden");
  submitBtn.style.visibility = 'hidden';



  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);



  if (attemptCount > 1) {
    appSubtitle.innerText = `Well Done! It took you ${attemptCount} guesses!\n Next Round is in: `;
  } else {
    appSubtitle.innerText = `Well Done! It took you ${attemptCount} guess!\n Next Round is in: `;
  }


  parseTime(nextRound);

  setInterval(() => {
    if (nextRound <= 0) {
      window.location.reload(true);
      localStorage.clear();
    }
    nextRound -= 1000;
    parseTime(nextRound);
  }, 1000)

  appSubtitle.append(timer);

  const shareWidget = document.createElement("div");
  const shareXBtn = document.createElement("a");
  const shareWidgetText = document.createElement("p");
  const text = `I got today's Pterodactdle in ${attemptCount} attempt(s)! #Pterodactdle`;
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);

  shareWidget.setAttribute("class", "share-widget")
  shareXBtn.setAttribute("class", "twitter-share-button");
  shareXBtn.setAttribute("href", url);
  shareXBtn.setAttribute("data-size", "large");


  shareWidgetText.innerText = "Share your result on X!"
  shareXBtn.innerText = "Tweet";
  shareWidget.append(shareWidgetText);
  shareWidget.append(shareXBtn);
  appSubtitle.append(shareWidget);
  twttr.widgets.load();
}



//DISPLAY LABELS
//listen for clicked tiles 
(() => {
  const grid = document.querySelector('.results-container');
  grid.addEventListener("click", (e) => {

    //grab the clicked tile
    const tile = e.target.closest('.square');
    if (!tile) return;

    let tileNodes = tile.childNodes;

    //iterate through tile nodes
    //Check if the node is active and close it.
    tileNodes.forEach(node => {

      let list = document.querySelectorAll(".label-container")
      list.forEach(node => {
        if (!node.classList.value.includes("hidden")) {
          node.classList.toggle("hidden");
        }
      })
      if (node.classList.value.includes("label-container")) {
        node.classList.toggle("hidden");
      }
    });
  })
  // Handle clicks outside the grid
  document.addEventListener("click", (e) => {
    // if the click happened *inside* the grid, ignore it
    if (e.target.closest('.results-container')) return;

    // otherwise, hide all visible labels
    document.querySelectorAll(".label-container:not(.hidden)").forEach(label => {
      label.classList.add("hidden");
    });

  })
})();

//add label
function addLabel(desc) {
  for (const description in desc) {
    const tile = document.getElementsByClassName(description);

    const labelContainer = document.createElement('div');
    const labelContent = document.createElement('div');
    const label = document.createElement('p');

    labelContainer.classList.add("hidden", "label-container");
    labelContent.classList.add("label-content");
    label.classList.add("label-text");
    label.innerText = desc[description];

    labelContainer.append(labelContent);
    labelContent.append(label);

    tile[0].appendChild(labelContainer);
  }
}

//TIMER
const timer = document.createElement("h2");

function parseTime(timeInMs) {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  timer.innerHTML = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
}


//Misc On first launch/refresh, Session Management

window.addEventListener("DOMContentLoaded", async () => {

  function getListOfDinos() {
    return axios.get("api/v1/dinos/", {
      withCredentials: true
    });
  }

  function getSessionData() {
    return axios.get("api/v1/dinos/session/", {
      withCredentials: true
    })
  }



  const [list, session] = await Promise.all([getListOfDinos(), getSessionData()]);

  const {
    data
  } = session;
  console.log(data);

  if (!data.rows.length) {
    localStorage.clear()
  }


  displayHint(data.session.attempts);

  //Get from local storage.
  for (let i = 0; i <= localStorage.length; i++) {

    let grid = JSON.parse(localStorage.getItem(i));
    if (!i && grid == null) continue;

    renderTiles(grid.row);
    addLabel(grid.desc);
  }


  let streak = data.session.streak;

  displayStreak(streak);
  const listOfDinosaurs = list.data.data;


  autocomplete(input, listOfDinosaurs);

  if (data.session.end_game) {
    endGame(data.session.attempts, data.nextRound);
  }
});


//STATS EVENT STREAM
const statsSection = document.getElementById("stats-section");
const statsText = document.createElement("p");

statsText.textContent = "Loading stats...";
statsSection.appendChild(statsText);

let eventSource = new EventSource('/api/v1/dinos/stats');

eventSource.addEventListener("daily correct guesses", (e) => {
  if (e.data == 1) {
    statsText.textContent = e.data + ` person has guessed correctly today!`;
  } else {
    statsText.textContent = e.data + ` people have guessed correctly today!`;
  }

});

statsSection.appendChild(statsText);