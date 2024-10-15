const mongoose = require('mongoose');

const PriestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: true
  },
  typeDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentType',
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  Calendar: {
    type: String,
    required: true,
  },
  resetCode: String,
  resetCodeExpires: Date
});


module.exports = mongoose.model('Priest',PriestSchema);