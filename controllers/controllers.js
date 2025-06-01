const Dino = require("../models/dinos");
const cron = require("node-cron");
const {result} = require("../logic/result");

console.log(result);
/*
 * DB Management
 * Create Many
 * Create One
 * Read All
 * Read One
 * Read One Random
 * Update One
 * Delete One
 */

//Create Many
/*const populateDB = async (req, res) => {
  const data = req.body;
  try {
    const dinos = await Dino.insertMany(data);

    return res.status(200).json({ msg: "success", data: data });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};
*/

//Create One
const createDino = async (req, res) => {
  try {
    const dino = await Dino.create(req.body);
    console.log(req.body);
    return res.status(200).json({ msg: "Success!", data: dino });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

//Read All
const getAllDinos = async (req, res) => {
  try {
    console.log(req.ip);
    const data = await Dino.find(
      {},
      { _id: 0, period: 0, diet: 0, clade: 0, height: 0, weight: 0, __v: 0 },
    ); //Second object passed to this function omits the _id and __v fields
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};

//Read One
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

//Update One
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

//Delete One
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

/*
 * Guessing logic
 * randomDoc{} - Pulls random document from DB and stores it in dotd.
 * userGuess{} - Uses the user's input to retrieve a dinosaur from the DB and stores it in userGuessDino
 * result{}    - Compare both objects and return an answer object (see below)
 *
 * */

let dotd = null;
let userGuessDino = null;

//Read One Random
const randomDoc = async (req, res) => {
  try {
    const randomDino = await Dino.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 0, __v: 0 } }, //OMITS THE ANNOYING _id and __v fields
    ]);
    dotd = randomDino[0];
    console.log(`(Inside randomDoc) ${JSON.stringify(dotd)}`);
    //res.status(200).json({ msg: "Success!", data: randomDino[0] });
    return dotd;
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//cron job to call function once per day.

cron.schedule("* * * * *", () => {
  randomDoc();
});

const userGuess = async (req, res) => {
  try {
    userGuessDino = await Dino.findOne(req.body, { _id: 0, __v: 0 });
    console.log(`(inside userGuess) ${JSON.stringify(userGuessDino)}`);
    answer = result(userGuessDino, dotd);
    return res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


/*
 * Send array of dinos for autocomplete list
 * 
 *  
 * 
 *
 * */

const getCleanArray = async (req, res) => {
  try{
    let dinos = await Dino.find().select("name -_id");
    let cleanArray = dinos.map(dino => dino.name);
    res.status(200).json(cleanArray);
  } catch (error){
    res.status(500).json({msg: error.message});
  }
}











//Export to Routes
module.exports = {
  getAllDinos,
  getDino,
  createDino,
  editDino,
  removeDino,
  userGuess,
  getCleanArray
};
