const express = require('express');
const accidentReportController = require('../controllers/accidents.controller');
const router = express.Router();


router.get('/', accidentReportController.allReports);
router.get('/:id', accidentReportController.getReportById);
router.post('/', accidentReportController.reportAccident);

module.exports = router;
