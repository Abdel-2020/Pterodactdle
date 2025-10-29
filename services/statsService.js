const {
    query,
    pool
} = require("../db/connect");

//Migrated to PG

exports.getDailyCorrect = async () => {
    try{
        text = 'SELECT COUNT(end_game) FROM player_states WHERE end_game = $1';
        values = [true];
        let resp =  await query(text, values)
        console.log(resp.rows[0].count)
        count = resp.rows[0].count;
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
}