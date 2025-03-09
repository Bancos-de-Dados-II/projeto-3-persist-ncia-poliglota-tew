import express from 'express';
import dotenv from 'dotenv';
import { connectDB, redisClient } from './config/database.js';
import eventoRouter from './router/eventoRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'views')));

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
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
