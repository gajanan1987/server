const database = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  try {
    const saltRounds = 10;
    const sql =
      "INSERT INTO student (`fname`, `lname`, `email`, `password`, `mobile`, `gender`, `state`,`address`) VALUES (?)";

    // Hash the password
    const hash = await bcrypt.hash(req.body.password.toString(), saltRounds);

    // Prepare the values
    const values = [
      req.body.fname,
      req.body.lname,
      req.body.email,
      hash,
      req.body.mobile,
      req.body.gender,
      req.body.state,
      req.body.address,
    ];
    const data = await database.query(sql, [values]);

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Inserting data Error in server response",
      });
    } else {
      res.status(201).send({
        success: true,
        message: "Inserting data",
        data: data[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Inserting API",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const sql = "SELECT * FROM student WHERE email = ?";

    // Prepare the values
    const values = [req.body.email];
    const [data] = await database.query(sql, values);

    if (data.length === 0) {
      // return res.status(404).send({
      //   success: false,
      //   message: "Invalid email",
      // });
      return res.json({
        success: false,
        message: "Invalid email",
      });
    }

    const user = data[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(
      req.body.password.toString(),
      user.password
    );

    if (!isMatch) {
      // return res.status(401).send({
      //   success: false,
      //   message: "Invalid password",
      // });
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    // Create JWT token (example)
    const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", {
      expiresIn: "10m",
    });

    res.cookie("access_token", token, {
      httpOnly: true, // The cookie is not accessible by JavaScript
      maxAge: 10 * 60 * 1000, // Cookie expires in 10 minutes
      secure: false, // Do not require HTTPS on localhost
      sameSite: "lax", // Helps prevent CSRF attacks (adjust according to your needs)
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      access_token: token,
      // data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Inserting API",
      error,
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    console.log("🚀 ~ verifyUser ~ token:", token);
    if (!token) {
      return res.json({ error: true, message: "yor are not authenticated" });
    } else {
      jwt.verify(token, "secretkey", (error, decode) => {
        if (error) {
          return res.json({ error: true, message: "Token is not valid" });
        } else {
          req.email = decode.email;
          return res.json({ status: "success", email: req.email });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in verifying user",
      error,
    });
  }
};

module.exports = { registerController, loginController, verifyUser };
