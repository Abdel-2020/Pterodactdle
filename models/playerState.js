const mongoose = require("mongoose");
const PlayerStateSchema = new mongoose.Schema({
    
    playerSessionID: {
        type: String,
        required: [true, "A value for the ID must be provided"],
        trim: true,
    },

    endGame: {
    type: Boolean, 
    default: false,
    },

    attempts: {
        type: Number, 
        default: 0,
    },

    rows: {
        type:[], default: []
    },
    
})

module.exports = mongoose.model("PlayerState", PlayerStateSchema);