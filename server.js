import express from 'express';
import dotenv from 'dotenv';
import { connectDB, redisClient } from './config/database.js';
import eventoRouter from './router/eventoRouter.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

// Conexão com o redis
redisClient.connect()
  .then(() => {
    console.log('Conectado ao Redis');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao Redis:', err);
  });

app.use('/eventos', eventoRouter);


app.get('/', (req, res) => {
  res.send('Servidor rodando e banco de dados conectado!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
