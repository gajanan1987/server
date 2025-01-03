const database = require("../config/db");

//Get All Student List
const getStudents = async (req, res) => {
  try {
    const data = await database.query("SELECT * FROM student");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Reacord found for student",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "All students Records",
        data: data[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Students API",
      error,
    });
  }
};

const getStudentsById = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId) {
      return res.status(404).send({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const data = await database.query(`SELECT * FROM student WHERE id=?`, [
      studentId,
    ]);
    if (data[0].length === 0) {
      return res.status(404).send({
        success: false,
        message: "students Records not found",
      });
    } else {
      res.status(200).send({
        success: true,
        data: data[0],
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Get Student By Id",
      error,
    });
  }
};

module.exports = { getStudents, getStudentsById };
