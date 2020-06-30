const express = require('express');
const router = express.Router();
const reportCtrl = require('../../controllers/reports');

router.get('/run/:id', reportCtrl.runReport);
router.get('/:id', reportCtrl.getAll);
router.post('/', reportCtrl.create);
router.delete('/:id', reportCtrl.deleteById);
router.put('/', reportCtrl.update);

module.exports = router;