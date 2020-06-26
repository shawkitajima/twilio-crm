const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/csv/contacts');
const multer = require('multer');
const upload = multer({dest: 'tmp/csv/'});

router.post('/', upload.single('file'), contactsCtrl.create);
router.delete('/', upload.single('file'), contactsCtrl.deleteByIds);
router.put('/', upload.single('file'), contactsCtrl.updateByIds);

module.exports = router;