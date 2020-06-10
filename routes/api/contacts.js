const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/contacts');
const multer = require('multer');
const upload = multer({dest: 'tmp/csv/'});

router.post('/', contactsCtrl.create);
router.post('/create/csv', upload.single('file'), contactsCtrl.createFromCSV);
router.delete('/:userId/:contactId', contactsCtrl.deletebyId);
router.put('/', contactsCtrl.updatebyId);

module.exports = router;