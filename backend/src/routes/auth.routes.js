const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');


const router = express.Router();


router.post('/register', register);
router.post('/login', login);


router.get('/me', auth, (req, res) => {
res.json(req.user);
});


module.exports = router;