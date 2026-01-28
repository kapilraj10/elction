const express = require('express');
const router = express.Router();
const commitmentCtrl = require('../controllers/commitment.controller');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

// Public: list published commitments
router.get('/', commitmentCtrl.listCommitments);
router.get('/:id', commitmentCtrl.getCommitment);

// Admin: manage commitments
router.post('/', auth, isAdmin, commitmentCtrl.createCommitment);
router.put('/:id', auth, isAdmin, commitmentCtrl.updateCommitment);
router.delete('/:id', auth, isAdmin, commitmentCtrl.deleteCommitment);

module.exports = router;
