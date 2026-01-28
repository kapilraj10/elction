const express = require('express');
const router = express.Router();
const suggestionCtrl = require('../controllers/suggestion.controller');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

// Public: create suggestion
router.post('/', suggestionCtrl.createSuggestion);

// Admin: manage suggestions
router.get('/', auth, isAdmin, suggestionCtrl.listSuggestions);
router.get('/:id', auth, isAdmin, suggestionCtrl.getSuggestion);
router.put('/:id', auth, isAdmin, suggestionCtrl.updateSuggestion);
router.delete('/:id', auth, isAdmin, suggestionCtrl.deleteSuggestion);

module.exports = router;
