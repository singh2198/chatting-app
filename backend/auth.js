const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; 


function generateToken(user) {
  let token=jwt.sign({ email: user.email, password: user.password }, process.env.JWT_TOKEN, { expiresIn: '1h' });
    console.log("login token ",token);
    return token;
}


function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
}

module.exports = { generateToken, verifyToken };
