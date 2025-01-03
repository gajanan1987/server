const express = require("express");
const {
  loginController,
  registerController,
  verifyUser,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/", verifyUser);
authRouter.post("/login", loginController);
authRouter.post("/register", registerController);

module.exports = authRouter;
