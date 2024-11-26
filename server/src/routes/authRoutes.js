const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
} = require("../controllers/authController");
const { isAuthenticatedUser } = require("../middleWare/authMiddleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUser); 
router.get("/validate-token", isAuthenticatedUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
