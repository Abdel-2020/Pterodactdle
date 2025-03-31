const Dino = require("../models/dinos");
/*
 * DB Management
 *
 *
 *
 *
 * */

//populate DB TICK
const populateDB = async (req, res) => {
  const data = req.body;
  try {
    const dinos = await Dino.insertMany(data);

    return res.status(200).json({ msg: "success", data: data });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

//create a dino and add it to the db TICK
const createDino = async (req, res) => {
  try {
    const dino = await Dino.create(req.body);
    console.log(req.body);
    return res.status(200).json({ msg: "Success!", data: dino });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

//retrieve all dinos from the db TICK
const getAllDinos = async (req, res) => {
  try {
    console.log(req.ip);
    const data = await Dino.find({}, { _id: 0, period:0, diet:0, clade:0, height:0, weight:0, __v: 0 }); //Second object passed to this function omits the _id and __v fields
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};

//retrieve a specifc dino from the db TICK
const getDino = async (req, res) => {
  try {
    //grab route parameter
    const { id } = req.params;
    console.log(id);

    //search the DB
    const dino = await Dino.findById(id);

    //check if dino exists
    if (!dino) {
      return res.status(404).json({ msg: "Dinosaur not found" });
    }

    return res.status(200).json({ msg: "Success!", data: { dino } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


//Retrieve a RANDOM Dino from the DB TICK

const randomDoc = async (req, res) => {
  try {
    const randomDino = await Dino.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 0, __v: 0 } }, //OMITS THE ANNOYING _id and __v fields
    ]);
    //console.log(randomDino[0]);
    //res.status(200).json({ msg: "Success!", data: randomDino[0] });
    return randomDino[0];
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//get user guess TICK
const userGuess = async (req, res) => {
  //answer object will store correct/inccorect matches
  answer = {};
  try {
    //Get User Guess
    const userGuess = req.body;
    //Find dino in DB
    const userGuessDino = await Dino.findOne(userGuess, { _id: 0, __v: 0 });
    //
    // console.log(dino);
    //Get DOTD
    const dotd = await randomDoc(req, res);

    //Compare both objects
    //First iterate through the DOTD object.
    //Checks if key exists within DOTD
    //Validating the user's guess against the DOTD "2" = correct guess, "+/-1" = incorrect with hint (greater or less than), "0" incorrect guess
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
      console.log(answer)
      res.status(200).json({ answer });
   
  } catch (error) {
    //console.log(error);
    res.status(500).json({ msg: error.message });
  }
};


//Update dino TICK
const editDino = async (req, res) => {
  try {
    //grab route parameter
    const { id } = req.params;
    //grab request body
    const data = req.body;

    const dino = await Dino.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    //check if dino exists
    if (!dino) {
      return res.status(404).json({ msg: "Dinosaur not found" });
    }

    return res.status(200).json({ msg: "Dinosaur Updated!", data: { dino } });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//Remove a Dino TICK
const removeDino = async (req, res) => {
  try {
    const { id } = req.params;
    const dino = await Dino.findByIdAndDelete(id);
    if (!dino) {
      return res.status(404).json({ msg: "Dinosaur not found" });
    }
    return res.status(200).json({ dino: dino, msg: "Removed from db" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//Dino of the day logic
//retrieve all data from mongoose db.
//Since it's stored in an array can do a random number pick?

//Export to Routes
module.exports = {
  getAllDinos,
  getDino,
  createDino,
  editDino,
  removeDino,
  populateDB,
  randomDoc,
  userGuess,
};
