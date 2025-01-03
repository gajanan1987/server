const express = require('express');
const { getStudents, getStudentsById } = require('../controllers/studentController');

//router object
const router = express.Router();

//routes

//Get all Students
router.get('/getall', getStudents)
router.get('/get/:id', getStudentsById)

module.exports = router;