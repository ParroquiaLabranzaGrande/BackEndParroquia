const mongoose = require('mongoose');

const requestConfessionsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    Priest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },

    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },
    
    status: {
        type: String,
        default: 'Pendiente'
    }
});

const requestConfessions = mongoose.model('RequestConfessions', requestConfessionsSchema);

module.exports = requestConfessions;
