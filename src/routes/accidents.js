const express = require('express');
const accidentReportController = require('../controllers/accidents.controller');
const router = express.Router();


router.get('/', accidentReportController.allReports);
router.get('/:id', accidentReportController.getReportById);
router.post('/', accidentReportController.reportAccident);
router.post('/detected', accidentReportController.detectedAccident);

module.exports = router;
