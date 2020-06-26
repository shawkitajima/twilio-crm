const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
    getById,
    signup,
    login,
};

function getById(req, res) {
    User.findById(req.params.id)
    .populate('contacts')
    .populate('contactFields')
    .exec((err, user) => {
        res.send(user);
    });
}

async function signup(req, res) {
  const user = new User(req.body);
  try {
    await user.save();
    // Send back a JWT instead of the user
    const token = createJWT(user);
    res.json({token, user});
  } catch (err) {
    // Probably a duplicate email
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).json({err: 'bad credentials'});
    user.comparePassword(req.body.pw, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}


// Make helper functions for JWT

function createJWT(user) {
  return jwt.sign(
    {user},
    SECRET,
    {expiresIn: '24h'}
  );
}
