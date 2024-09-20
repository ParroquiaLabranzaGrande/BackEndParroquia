const RequestDeparture = require('../models/requestDeparture');
const { verifyToken } = require('../helpers/gerate-token');
const userModel = require('../models/user');
const BaptismModel = require('../models/baptism');
const ConfirmationModel = require('../models/confirmation');
const DeathModel = require('../models/death');
const MarriageModel = require('../models/marriage');
const { generatePDF } = require('../services/pdfGenerator');
const emailService = require('../services/emailService');
const path = require('path');
const fs = require('fs');


module.exports = {

    getAllRequestsSent: async (req, res) => {
        try {
            const requests = await RequestDeparture.find({ status: 'Enviada' })
                .populate('applicant')
                .populate('departureId');
            
            const formattedRequests = requests.map(request => ({
                ...request.toObject(),
                requestDate: request.requestDate.toISOString().split('T')[0]
            }));
            
            res.json(formattedRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getAllRequestsEarring: async (req, res) => {
        try {
            const requests = await RequestDeparture.find({ status: 'Pendiente' })
                .populate('applicant')
                .populate('departureId');
            
            const formattedRequests = requests.map(request => ({
                ...request.toObject(),
                requestDate: request.requestDate.toISOString().split('T')[0]
            }));
            
            res.json(formattedRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    createRequestDeparture : async (req, res) => {
        try {
            const { departureType } = req.body;
            const token = req.headers.authorization?.split(' ').pop();
    
            if (!token) {
                return res.status(401).json({ error: 'No se proporcionó token de autorización' });
            }
    
            const tokenData = await verifyToken(token);
            const userData = await userModel.findById(tokenData._id);
    
            if (!userData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            let departureModel;
            let query;
    
            switch (departureType) {
                case 'Baptism':
                    departureModel = BaptismModel;
                    query = { baptized: userData._id };
                    break;
                case 'Confirmation':
                    departureModel = ConfirmationModel;
                    query = { confirmed: userData._id };
                    break;
                case 'Death':
                    departureModel = DeathModel;
                    query = { dead: userData._id };
                    break;
                case 'Marriage':
                    departureModel = MarriageModel;
                    // Para matrimonios, buscamos en ambos campos `groom` y `bride`
                    query = {
                        $or: [
                            { husband: userData._id },
                            { wife: userData._id }
                        ]
                    };
                    break;
                default:
                    return res.status(400).json({ error: 'Tipo de partida no válido' });
            }
    
            // Busca la partida en la base de datos usando la consulta adecuada
            const existingDeparture = await departureModel.findOne(query);
    
            if (!existingDeparture) {
                return res.status(404).json({ error: 'No se encontró una partida para este usuario' });
            }
    
            const newRequestDeparture = new RequestDeparture({
                departureType,
                applicant: userData._id,
                departureId: existingDeparture._id
            });
    
            const savedRequestDeparture = await newRequestDeparture.save();
    
            res.status(201).json(savedRequestDeparture);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la solicitud de partida', details: error.message });
        }
    },

    sendDepartureDocument : async (req, res) => {
      try {
          const { requestId } = req.params;
  
          const request = await RequestDeparture.findById(requestId);
          if (!request) {
              return res.status(404).json({ message: 'Solicitud no encontrada' });
          }
  
          let departureData;
          let Model;
          switch (request.departureType) {
              case 'Baptism':
                  Model = BaptismModel;
                  departureData = await Model.findById(request.departureId).populate('baptized'); // Ajusta según tus esquemas
                  break;
              case 'Confirmation':
                  Model = ConfirmationModel;
                  departureData = await Model.findById(request.departureId).populate('confirmed'); // Ajusta según tus esquemas
                  break;
              case 'Death':
                  Model = DeathModel;
                  departureData = await Model.findById(request.departureId).populate('dead'); // Ajusta según tus esquemas
                  break;
              case 'Marriage':
                  Model = MarriageModel;
                  departureData = await Model.findById(request.departureId).populate('husband wife'); // Ajusta según tus esquemas
                  break;
              default:
                  return res.status(400).json({ message: 'Tipo de partida no válido' });
          }
  
          if (!departureData) {
              return res.status(404).json({ message: `Partida de ${request.departureType} no encontrada` });
          }
  
          const user = await userModel.findById(request.applicant);
          if (!user) {
              return res.status(404).json({ message: 'Usuario solicitante no encontrado' });
          }
  
          const pdfPath = path.join(__dirname, '..', 'temp', `${request.departureType.toLowerCase()}_${departureData._id}.pdf`);
  
          await generatePDF(request.departureType, departureData, pdfPath);
  
          await emailService.sendDepartureDocument({
              departureType: request.departureType,
              applicant: user
          }, departureData, pdfPath);
  
          // Eliminar el archivo temporal
          fs.unlinkSync(pdfPath);
  
          request.status = 'Enviada';
          await request.save();
  
          res.status(200).json({ message: `Partida de ${request.departureType} procesada y enviada exitosamente` });
      } catch (error) {
          console.error('Error al procesar la solicitud de partida:', error);
          res.status(500).json({ message: 'Error al procesar la solicitud de partida', error: error.message });
      }
  },

  deleteRequestById: async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await RequestDeparture.findByIdAndDelete(id);
        
        if (!deletedRequest) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        
        res.json({ message: "Solicitud eliminada con éxito", deletedRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
  
}
