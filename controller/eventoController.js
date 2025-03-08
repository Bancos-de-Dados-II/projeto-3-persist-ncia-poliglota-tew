import Evento from '../model/evento.js';
import { redisClient } from '../config/database.js';

// Listarr
export async function listarEventos(req, res) {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).send("Erro ao listar os eventos");
  }
}

// Criar
export async function criarEvento(req, res) {
  try {
    const evento = new Evento(req.body);
    await evento.save();

    // Atualizar o cache no redis após criar o evento
    await redisClient.set(`evento:${evento._id}`, JSON.stringify(evento));

    res.status(201).json(evento);
  } catch (err) {
    res.status(400).send("Erro ao criar o evento");
  }
}

// Buscar um evento por id com cache no redis
export async function buscarEventoPorId(req, res) {
  try {
    const eventoId = req.params.id;

    // Primeiro: tentar buscar no redis
    const cachedEvento = await redisClient.get(`evento:${eventoId}`);
    
    if (cachedEvento) {
      console.log('Evento encontrado no cache');
      return res.json(JSON.parse(cachedEvento));
    }

    // Se não estiver no redis: buscar no mongo
    const evento = await Evento.findById(eventoId);
    
    if (!evento) {
      return res.status(404).send("Evento não encontrado");
    }

    // Salvar no redis para ficar no cache
    await redisClient.set(`evento:${eventoId}`, JSON.stringify(evento));

    console.log('Evento encontrado no MongoDB e salvo no cache');
    return res.json(evento);
  } catch (err) {
    res.status(500).send("Erro ao buscar evento");
  }
}

// Atualizar
export async function atualizarEvento(req, res) {
  try {
    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!evento) {
      return res.status(404).send("Evento não encontrado");
    }

    // Atualizar o cache no redis após atualizar o evento
    await redisClient.set(`evento:${evento._id}`, JSON.stringify(evento));

    res.json(evento);
  } catch (err) {
    res.status(400).send("Erro ao atualizar evento");
  }
}

// Deletar
export async function deletarEvento(req, res) {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);

    if (!evento) {
      return res.status(404).send("Evento não encontrado");
    }

    // Remover o evento do cache
    await redisClient.del(`evento:${evento._id}`);

    res.json({ message: "Evento deletado com sucesso" });
  } catch (err) {
    res.status(500).send("Erro ao deletar evento");
  }
}
