const Dino = require("../models/dinos");
/*
 * DB Management
 *
 *
 *
 *
 * */

//populate DB
const populateDB = async (req, res) => {
  const data = req.body;
  try {
    const dinos = await Dino.insertMany(data);

    return res.status(200).json({ msg: "success", data: dinos });
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
    const dinos = await Dino.find({});
    return res.status(200).json({ msg: "success!", data: dinos });
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

//Retrieve a RANDOM Dino from the DB

const randomDoc = async (req, res) => {
  try {
    const randomDino = await Dino.aggregate([{ $sample: { size: 1 } }]);
    console.log(randomDino[0]);
    return res.status(200).json({ msg: "Success!", data: randomDino[0] });
  } catch (error) {
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
};
