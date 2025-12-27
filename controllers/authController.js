const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
