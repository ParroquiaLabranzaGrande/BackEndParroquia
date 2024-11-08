const express = require('express');
const router = express.Router();

const {
    createConfessionSchedule,
    removeTimeSlots,
    getTimeSlots
} = require('../controllers/controll-confesionsSchedule');

router.post('/', createConfessionSchedule);

// Ruta para eliminar un horario disponible
router.post('/remove-time-slots', removeTimeSlots);

// Ruta para obtener los horarios
router.get('/time-slots', getTimeSlots);  
module.exports = router;