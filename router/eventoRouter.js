import express from 'express';
import {
  listarEventos,
  criarEvento,
  buscarEventoPorId,
  atualizarEvento,
  deletarEvento,
} from '../controller/eventoController.js';

const eventoRouter = express.Router();

eventoRouter.get('/', listarEventos);
eventoRouter.get('/:id', buscarEventoPorId);
eventoRouter.post('/', criarEvento);
eventoRouter.delete('/:id', deletarEvento);
eventoRouter.patch('/:id', atualizarEvento);

export default eventoRouter;
