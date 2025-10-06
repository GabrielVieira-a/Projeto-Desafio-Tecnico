const express = require('express');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);

// Teste conexão DB e servidor
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado!');
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
}).catch(err => console.error('Erro ao conectar ao banco:', err));
