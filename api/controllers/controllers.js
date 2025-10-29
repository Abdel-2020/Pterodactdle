const {
    query,
    pool
} = require("../../db/connect");
//const Dino = require("../../models/dinos");
const cron = require("node-cron");
const guessService = require("../../services/guessService");
const sessionServices = require("../../services/sessionService");
const statsService = require("../../services/statsService");


// Create One - Migrated to PG
const createDino = async (req, res) => {
    try {
        // Grab route parameter
        const {
            id
        } = req.params;
        // Grab request body
        const body = req.body;
        const values = [...Object.values(body)]
        console.log(values);
        const text = 'INSERT INTO dinosaurs (name, period_id, diet_id, clade_id, length, description, hint) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const resp = await query(text, values);

        // Check if dino exists first otherwise return a 404
        return res.status(200).json({
            msg: "Dinosaur Succesfully Added!",
            resp

        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message

        });
    }
};

// Read One - Migrated to PG
const getDino = async (req, res) => {
    try {
        //grab route parameter
        const {
            id
        } = req.params;
        const text = 'SELECT * FROM dinosaurs WHERE id = $1'
        const values = [parseInt(id)];

        console.log(`Route Parameter (Dinosaur ID): ${values}`);
        const resp = await query(text, values);

        const data = resp.rows;

        return res.status(200).json({
            msg: "Success!",
            data
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

// Read All - Migrated to PG
const getAllDinos = async (req, res) => {
    try {
        const dinosaurList = await query('SELECT name FROM dinosaurs');
        const data = [];
        for (let i = 0; i < dinosaurList.rows.length; i++) {
            data[i] = dinosaurList.rows[i].name;
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

// Update One - Migrated to PG
const editDino = async (req, res) => {

    try {
        // Grab route parameter
        const {
            id
        } = req.params;
        // Grab request body
        const body = req.body;
        const values = [parseInt(id), ...Object.values(body)]

        const text = 'UPDATE dinosaurs SET name = $2, period_id = $3, clade_id =$4, diet_id=$5 WHERE id = $1';
        const data = await query(text, values);

        // Check if dino exists first otherwise return a 404
        return res.status(200).json({
            msg: "Dinosaur Updated!",
            data

        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// Delete One - Migrated to PG
const removeDino = async (req, res) => {
    try {
        //grab route parameter
        const {
            id
        } = req.params;
        const text = 'DELETE FROM dinosaurs WHERE id = $1'
        const values = [parseInt(id)];

        const resp = await query(text, values);
        const data = resp.rows;

        console.log(data);

        return res.status(200).json({
            msg: "Success!",
            data
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

const resetGameState = async (req, res) => {
    try {
        await sessionServices.resetPlayerState();
        res.status(200).json({
            msg: "All non valid sessions have been cleared"
        });
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }

}


let dotd = null;

//Read One Random - Migrated to PG
const randomDoc = async () => {
    try {
        const text = 'SELECT dinosaurs.name, period.period,  diets.diet, clades.clade,  dinosaurs.length, dinosaurs.hint FROM dinosaurs  JOIN period ON dinosaurs.period_id = period.id JOIN diets ON dinosaurs.diet_id = diets.id JOIN clades ON dinosaurs.clade_id = clades.id OFFSET floor(random() * (SELECT COUNT(*)  FROM dinosaurs)) LIMIT 1';
        const resp = await query(text);

        const dino = {
            name: resp.rows[0].name,
            period: resp.rows[0].period,
            diet: resp.rows[0].diet,
            clade: resp.rows[0].clade,
            length: resp.rows[0].length
        }

        const hint = resp.rows[0].hint;


        console.log('DINO OF THE DAY:')
        console.log(dino);
        console.log('Hint:')
        console.log(hint);


        dotd = {
            dino,
            hint
        };
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
};

const getHint = (req, res) => {
    res.status(200).json(dotd.hint);
}

const userGuess = async (req, res) => {
    const sessionID = req.sessionID;
    const {
        id
    } = req.params;

    try {
        const text = 'SELECT dinosaurs.name, period.period, period.period_description, diets.diet, diets.diet_description, clades.clade, clades.clade_description, dinosaurs.length, dinosaurs.description, dinosaurs.hint FROM dinosaurs  JOIN period ON dinosaurs.period_id = period.id JOIN diets ON dinosaurs.diet_id = diets.id JOIN clades ON dinosaurs.clade_id = clades.id WHERE dinosaurs.name = $1';
        const values = [id];
        const resp = await query(text, values);

        const userGuessDino = {name, period, diet, clade, length} = resp.rows[0];
       
        const desc = {
            name: resp.rows[0].description,
            period: resp.rows[0].period_description,
            diet: resp.rows[0].diet_description,
            clade: resp.rows[0].clade_description,
        }

        console.log("user guessed: " + JSON.stringify(userGuessDino.name));

        const answer = await guessService.handleGuess(userGuessDino, dotd.dino, sessionID);
        console.log('ANSWER OBJECT');
        console.log(answer);

        if (answer.result.correct) {
            res.cookie("id", sessionID, {
                signed: true,
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: answer.nextRound + (24 * 60 * 60 * 1000) //Until the end of the following round. Then wipes streak.
            });
        }

        return res.status(200).json({
            answer,
            desc
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

sessionServices.resetPlayerState();

randomDoc();
cron.schedule("0 0 * * *", async () => {
    try {
        await sessionServices.resetPlayerState();
        await randomDoc();
    } catch (error) {
        return error.message;
    }
});


//Session Management
const manageSession = async (req, res) => {
    try {
        const {
            sessionID
        } = req;
        const {
            session,
            nextRound
        } = await sessionServices.getPlayerState(sessionID);

        const rows = await sessionServices.getGuess(sessionID);

        console.log('Sending data to frontend......')

        res.status(200).json({
            session,
            rows,
            nextRound
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
    //populateDB,
    getAllDinos,
    getDino,
    randomDoc,
    createDino,
    editDino,
    removeDino,
    userGuess,
    manageSession,
    getStats,
    getHint,
    resetGameState 
};