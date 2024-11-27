const Confirmation = require('../models/confirmation');
const User = require('../models/user');

module.exports = {
  // Obtener todas las confirmaciones
  getAllConfirmations: async (req, res) => {
    try {
      const confirmations = await Confirmation.find().populate({
        path: 'confirmed',
        select: 'name lastName documentNumber mail role',
      });

      res.json(confirmations);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener las confirmaciones', error: err.message });
    }
  },

  // Crear una nueva confirmación
  createConfirmation: async (req, res) => {
    try {
      const { confirmationDate, documentNumber, ...rest } = req.body;
      const currentDate = new Date();

      // Verificar que la fecha de confirmación no sea futura
      if (new Date(confirmationDate) > currentDate) {
        return res.status(400).json({ message: 'La fecha de confirmación no puede ser futura' });
      }

      // Buscar el usuario por número de documento
      const user = await User.findOne({ documentNumber });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Crear y guardar la nueva confirmación
      const newConfirmation = new Confirmation({
        ...rest,
        confirmationDate,
        confirmed: user._id,
      });

      const savedConfirmation = await newConfirmation.save();
      res.status(201).json(savedConfirmation);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la confirmación', error: error.message });
    }
  },

  // Obtener una confirmación por número de documento del usuario
  getConfirmationByDocumentNumber: async (req, res) => {
    try {
      const { documentNumber } = req.params;

      // Buscar el usuario por su número de documento
      const user = await User.findOne({ documentNumber });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Buscar la confirmación usando el ID del usuario
      const confirmation = await Confirmation.findOne({ confirmed: user._id }).populate({
        path: 'confirmed',
        select: 'name lastName documentNumber mail role',
      });

      if (!confirmation) {
        return res.status(404).json({ message: 'Confirmación no encontrada para este usuario' });
      }

      res.json(confirmation);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la confirmación', error: error.message });
    }
  },

  // Actualizar una confirmación por número de documento del usuario
  updateConfirmationByDocumentNumber: async (req, res) => {
    try {
      const { documentNumber } = req.params;

      // Buscar el usuario por su número de documento
      const user = await User.findOne({ documentNumber });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar la confirmación
      const updatedConfirmation = await Confirmation.findOneAndUpdate(
        { confirmed: user._id },
        req.body,
        { new: true, runValidators: true }
      ).populate('confirmed', 'name lastName documentNumber mail role');

      if (!updatedConfirmation) {
        return res.status(404).json({ message: 'Confirmación no encontrada para actualizar' });
      }

      res.json(updatedConfirmation);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la confirmación', error: error.message });
    }
  },

  // Eliminar una confirmación por número de documento del usuario
  deleteConfirmationByDocumentNumber: async (req, res) => {
    try {
      const { documentNumber } = req.params;

      // Buscar el usuario por su número de documento
      const user = await User.findOne({ documentNumber });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Eliminar la confirmación
      const deletedConfirmation = await Confirmation.findOneAndDelete({ confirmed: user._id });
      if (!deletedConfirmation) {
        return res.status(404).json({ message: 'Confirmación no encontrada para eliminar' });
      }

      res.json({ message: 'Confirmación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la confirmación', error: error.message });
    }
  },
};
