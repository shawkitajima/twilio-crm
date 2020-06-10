const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/contacts');

router.post('/', contactsCtrl.create);
router.delete('/:userId/:contactId', contactsCtrl.deletebyId);
router.put('/', contactsCtrl.updatebyId);

module.exports = router;