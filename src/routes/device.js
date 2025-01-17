const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/devices.controller');
const upload = require('../middleware/keysMiddleware');

router.get('/', deviceController.allDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'private_key', maxCount: 1 },
    { name: 'public_key', maxCount: 1 },
    { name: 'ca', maxCount: 1 }
]), deviceController.createDevice);
router.post('/conect/{id}', deviceController.connectDevice);
router.post('/hundred/', deviceController.createHundredDevice)
router.put('/:id', upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'private_key', maxCount: 1 },
    { name: 'public_key', maxCount: 1 },
    { name: 'ca', maxCount: 1 }
]),deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;