const Dino = require("../../models/dinos");
const cron = require("node-cron");
const guessService = require("../../services/guessService");
const sessionServices = require("../../services/sessionService");
const statsService = require("../../services/statsService");



// Create Many
const populateDB = async (req, res) => {
    const data = req.body;
    try {
        const dinos = await Dino.insertMany(data);

        return res.status(200).json({
            msg: "success",
            data: data
        });
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        });
    }
};

// Create One
const createDino = async (req, res) => {
    try {
        const dino = await Dino.create(req.body);
        return res.status(200).json({
            msg: "Success!",
            data: dino
        });
    } catch (error) {
        return res.status(400).json({
            msg: error
        });
    }
};

// Read All
const getAllDinos = async (req, res) => {

    try {
        const dinosaurList = await Dino.find({}, {
            _id: 0,
            period: 0,
            diet: 0,
            clade: 0,
            height: 0,
            weight: 0,
            __v: 0,
        }, ).lean(); // Second object passed to this function turns the response from a mongoose object to JSON. 


        const data = [];
        for (let i = 0; i < dinosaurList.length; i++) {
            data[i] = dinosaurList[i].name;
        }


        return res.status(200).json({
            data
        });
    } catch (error) {
        return res.status(404).json({
            msg: error
        });
    }
};

// Read One
const getDino = async (req, res) => {
    try {
        //grab route parameter
        const {
            id
        } = req.params;

        // search the DB
        const dino = await Dino.findById(id);

        // check if dino exists
        if (!dino) {
            return res.status(404).json({
                msg: "Dinosaur not found"
            });
        }

        return res.status(200).json({
            msg: "Success!",
            data: {
                dino
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

// Update One
const editDino = async (req, res) => {
    try {
        // Grab route parameter
        const {
            id
        } = req.params;
        // Grab request body
        const data = req.body;

        const dino = await Dino.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        // Check if dino exists
        if (!dino) {
            return res.status(404).json({
                msg: "Dinosaur not found"
            });
        }

        return res.status(200).json({
            msg: "Dinosaur Updated!",
            data: {
                dino
            }
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// Delete One
const removeDino = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const dino = await Dino.findByIdAndDelete(id);
        if (!dino) {
            return res.status(404).json({
                msg: "Dinosaur not found"
            });
        }
        return res.status(200).json({
            dino: dino,
            msg: "Removed from db"
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};



let dotd = null;

// Read One Random
const randomDoc = async () => {
    try {
        const randomDino = await Dino.aggregate([{
                $sample: {
                    size: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0
                }
            }, // OMITS THE ANNOYING _id and __v fields
        ]);

        dotd = randomDino[0],


            console.log(dotd);
        return dotd;

    } catch (error) {
        console.log(error.message);

    }
};


const userGuess = async (req, res) => {
    let sessionID = req.sessionID;
    console.log("req.body is: ")
    console.log(req.body);

    try {
        let userGuessDino = await Dino.findOne(req.body, {
            _id: 0,
            __v: 0
        });
        console.log("user guess dino is:")
        console.log(userGuessDino)
        const answer = await guessService.handleGuess(userGuessDino, dotd, sessionID);
    
    if (answer.correct) {
        res.cookie("id", sessionID, {
        signed: true,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 //1 Day
      });
}

/*
    
*/

        return res.status(200).json({
            endGame: answer.correct,
            html: answer.html,
            attempts: answer.attempts,
            nextRound: answer.nextRound
        });

    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
};


/*
 *
 * Cron Job
 *  Resets users session. 
 *  Grabs a random dino from the DB at midnight.
 * 
 *
 */

randomDoc();
sessionServices.resetPlayerState();
cron.schedule("0 0 * * *", async () => {
    try {
        await sessionServices.resetPlayerState();
        await randomDoc();
    } catch (error) {
        return error.message;
    }

});


const manageSession = async (req, res) => {
    try {
        let data = await sessionServices.getPlayerState(req.sessionID);
        res.status(200).json({
            data
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
}


const getStats = async (req, res) => {

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');


        //initial connection
        console.log("User connected")
        res.write("event: init\n");
        res.write("data: connected\n\n");


        //Send an initial statistic
        let stat = await statsService.getDailyCorrect();
        res.write(`event: daily correct guesses\n`);
        res.write(`data: ${stat}\n\n`);
     

        //poll DB and send stats
        const interval = setInterval(async () => {
        let stat = await statsService.getDailyCorrect();

            res.write(`event: daily correct guesses\n`)
            res.write(`data: ${stat} \n\n`);
       
        }, 5000);

        req.on('close', () => {
            console.log('User disconnected');
            clearInterval(interval);
            res.end();
        })

    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    };

}

// Export to Routes
module.exports = {
    populateDB,
    getAllDinos,
    getDino,
    createDino,
    editDino,
    removeDino,
    userGuess,
    manageSession,
    getStats
};