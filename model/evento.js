import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    unique: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  data: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  publico_alvo: {
    type: String,
    required: true,
  },
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

eventoSchema.index({ localizacao: '2dsphere' });

const Evento = mongoose.model('Evento', eventoSchema);

export default Evento;
