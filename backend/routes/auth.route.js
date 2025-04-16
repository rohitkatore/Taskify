const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const {body} = require("express-validator");
const { authenticate, checkRole } = require("../middlewares/auth.middleware");

router.post("/register",[
    body("fullname").isLength({min:3}).withMessage("Fullname must be atleast 3 character."),
    body("email").isEmail().withMessage("Invalid Email."),
    body('password').isLength({min:6}).withMessage("passworld must be 6 character long.")
],authController.register);
router.post("/login",[
    body("email").isEmail().withMessage("Invalid Email."),
    body('password').isLength({min:6}).withMessage("passworld must be 6 character long.")
],authController.login);

router.get("/users",authenticate,checkRole(["admin"]),authController.getAllUsers);
router.get("/me",authenticate,authController.userData);

module.exports = router ;