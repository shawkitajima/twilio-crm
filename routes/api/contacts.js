const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/contacts');

router.get('/all/:id', contactsCtrl.getAllByUserId);
router.get('/:id', contactsCtrl.getOnebyContactId);
router.post('/', contactsCtrl.create);
router.delete('/:id', contactsCtrl.deletebyId);
router.put('/', contactsCtrl.updatebyId);

module.exports = router;