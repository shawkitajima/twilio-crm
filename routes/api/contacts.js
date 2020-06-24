const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/contacts');

router.get('/:id', contactsCtrl.getById);
router.post('/', contactsCtrl.create);
router.delete('/:id', contactsCtrl.deletebyId);
router.put('/', contactsCtrl.updatebyId);

module.exports = router;