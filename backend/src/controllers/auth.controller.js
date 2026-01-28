const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');


exports.register = async (req, res) => {
try {
const { name, email, password } = req.body;


const userExists = await User.findOne({ email });
if (userExists) {
return res.status(400).json({ message: 'User already exists' });
}


const user = await User.create({ name, email, password });


res.status(201).json({
token: generateToken(user._id),
user
});
} catch (error) {
res.status(500).json({ message: error.message });
}
};


exports.login = async (req, res) => {
try {
const { email, password } = req.body;


const user = await User.findOne({ email });
if (!user || !(await user.comparePassword(password))) {
return res.status(401).json({ message: 'Invalid credentials' });
}


res.json({
token: generateToken(user._id),
user
});
} catch (error) {
res.status(500).json({ message: error.message });
}
};