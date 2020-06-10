const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../controllers/csv/contacts');
const multer = require('multer');
const upload = multer({dest: 'tmp/csv/'});

router.post('/', upload.single('file'), contactsCtrl.create);

module.exports = router;