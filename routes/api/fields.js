const express = require('express');
const router = express.Router();
const fieldsCtrl = require('../../controllers/fields');

router.post('/', fieldsCtrl.create);
router.delete('/', fieldsCtrl.deleteById);
router.put('/', fieldsCtrl.update);

module.exports = router;