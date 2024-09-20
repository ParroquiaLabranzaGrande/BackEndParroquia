const express = require('express')
const router = express.Router()

const {
    createRequestDeparture,
    getAllRequestsSent,
    getAllRequestsEarring,
    sendDepartureDocument,
    deleteRequestById
  } = require('../controllers/controll-requestDeparture');


// Crear solicitud
router.post('/', createRequestDeparture);

router.post('/send/:requestId', sendDepartureDocument);

router.get('/Sent', getAllRequestsSent);

router.get('/earring', getAllRequestsEarring);

router.delete('/:id', deleteRequestById);

module.exports = router