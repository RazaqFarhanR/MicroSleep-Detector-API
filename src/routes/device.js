const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/devices.controller');

router.get('/', deviceController.allDevices);
router.post('/', deviceController.createDevice);
router.get('/:id', deviceController.getDeviceById);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;