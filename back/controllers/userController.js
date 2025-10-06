const User = require('../models/User');
const bcrypt = require('bcrypt');

// Cadastro de usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Se tiver código de referência, encontra o usuário que indicou
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ where: { referralCode } });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referredBy: referredByUser ? referredByUser.referralCode : null,
    });

    // Atualiza pontos de quem indicou
    if (referredByUser) {
      referredByUser.points += 1;
      await referredByUser.save();
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

// Buscar perfil
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};
