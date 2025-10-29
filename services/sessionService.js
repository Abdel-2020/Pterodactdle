const {
    query,
    pool
} = require("../db/connect");

const {
    timeLeft
} = require("../logic/countdown");


exports.storeGuess = async (sessionId, guess) => {
    console.log('Storing guess.....')
    const text = 'INSERT INTO guesses (session_id, guess) VALUES($1,$2)';
    const values = [sessionId, guess];
    const resp = await query(text, values);
}

exports.getGuess = async (sessionid) => {
    try {
        console.log('Getting all guess objects....');
        const text = 'SELECT guess FROM guesses WHERE session_id = $1';
        const values = [sessionid];
        const resp = await query(text, values);
        const rows = []
        resp.rows.forEach(row => {

            rows.push(row.guess);
        })


        return rows;
    } catch (error) {
        console.log(error);
        return error;
    }

}

//Migrated to PG
exports.resetPlayerState = async () => {
    console.log('Resetting state')
    try {
        const text = 'UPDATE player_states SET end_game = $1,attempts = $2 ';
        const values = [false, 0];

        resp = await query(text, values);

        clearGuesses();

        console.log('Resetting session...')
        console.log(resp.rows[0]);

    } catch (error) {
        return error.message;
    }

}

const clearGuesses = async () => {
    try {
        const text = 'DELETE FROM guesses * ';
        resp = await query(text);
        console.log('Clearing out guesses....');
    } catch (error) {
        return error;
    }


}
//Migrated to PG
exports.updatePlayerState = async (playerSessionID, correct, attempts, streak) => {
    try {
        const text = 'UPDATE player_states SET end_game = $2,  attempts = $3, streak = $4 WHERE session_id = $1 RETURNING session_id, end_game, streak, attempts';
        values = [playerSessionID, correct, attempts, streak];

        const resp = await query(text, values);
        console.log('Updating session.....')
        const session = resp.rows[0];
        console.log(session);
        return {
            session
        };

    } catch (error) {
        console.log(` error at updatePlayerState: ${error}`)
        return res.status(500).json(error.message)
    };
}

//Migrated to PG
exports.getPlayerState = async (sessionId) => {
    try {
        const text = 'SELECT end_game, streak, attempts FROM player_states WHERE session_id = $1';
        const values = [sessionId];

        let resp = await query(text, values);

        //Check for a stored session state 
        if (resp.rowCount == 0) {
            console.log("No session found, creating one now....");
            resp = await createPlayerState(sessionId);
        }

        console.log('Session found: ');
        const session = resp.rows[0];
        console.log(session);



        if (session.end_game) {
            return {
                session,
                nextRound: timeLeft()
            }
        } else {
            return {
                session
            }
        }


    } catch (error) {
        console.log(` error at getPlayerState: ${error}`)
    }

}
//Migrated to PG
const createPlayerState = async (sessionId, end_game, streak, guesses, attempts) => {
    try {
        const text = 'INSERT INTO player_states(session_id, end_game, streak,  attempts) VALUES($1, $2, $3, $4 ) RETURNING session_id, end_game, streak, attempts';
        const values = [sessionId, false, 0, 0];
        console.log('creating player state....')
        const resp = await query(text, values);
        return resp;

    } catch (error) {
        return error.message;
    }

}