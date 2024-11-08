const express = require('express');
const router = express.Router();


const {
  createRequestConfession,
  getPendingRequestConfessions,
  getConfirmedRequestConfessions,
  confirmRequestConfession,
  deleteRequestConfession
  } = require('../controllers/controll-confessions');

// Crear una nueva solicitud de misa
router.post('/', createRequestConfession);


router.post('/confirm/:id', confirmRequestConfession);

router.get('/earring', getPendingRequestConfessions);

router.get('/confirmed', getConfirmedRequestConfessions);

router.delete('/:id', deleteRequestConfession);

module.exports = router;