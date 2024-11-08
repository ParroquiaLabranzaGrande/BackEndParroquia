const mongoose = require('mongoose');

const confesionsScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },

  timeSlots: [
    {
      time: {
        type: String,  // Puedes cambiar esto a Date si prefieres almacenar la hora completa
        required: true
      },
      available: {
        type: Boolean,
        default: true
      },
      status: {
        type: String,
        default: "Libre"
      }
    }
  ]
});

const confessionsSchedule = mongoose.model('ConfessionSchedule', confesionsScheduleSchema);

module.exports = confessionsSchedule;
