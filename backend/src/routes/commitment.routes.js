const express = require('express');
const router = express.Router();
const commitmentCtrl = require('../controllers/commitment.controller');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');
const multer = require('multer');

// use memory storage and pass buffer to cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public: list published commitments
router.get('/', commitmentCtrl.listCommitments);
router.get('/:id', commitmentCtrl.getCommitment);

// Admin: manage commitments (supports optional pdf file upload under field name 'pdf')
router.post('/', auth, isAdmin, upload.single('pdf'), commitmentCtrl.createCommitment);
router.put('/:id', auth, isAdmin, upload.single('pdf'), commitmentCtrl.updateCommitment);
router.delete('/:id', auth, isAdmin, commitmentCtrl.deleteCommitment);

module.exports = router;
