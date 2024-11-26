const express = require("express");
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../middleWare/authMiddleware");
const {
  assignPermission,
  getAllUsers,
  getAllAdmins,
  deleteUser,
  blockOrUnblockUser,
  updateUserRole,
} = require("../controllers/userController");
const router = express.Router();

router.get(
  "/superadmin/all-admins",
  isAuthenticatedUser,
  authorizeRole("superadmin"),
  getAllAdmins
);

router.get(
  "/all-users",
  isAuthenticatedUser,
  authorizeRole("admin", "superadmin"),
  getAllUsers
);

router
  .route("/superadmin/assign-permission")
  .post(isAuthenticatedUser, authorizeRole("superadmin"), assignPermission);

router
  .route("/all-users/blockOrUnblockUser")
  .post(
    isAuthenticatedUser,
    authorizeRole("admin", "superadmin"),
    blockOrUnblockUser
  );

router
  .route("/all-users/:userId")
  .delete(isAuthenticatedUser, authorizeRole("admin", "superadmin"), deleteUser)
  .post(
    isAuthenticatedUser,
    authorizeRole("admin", "superadmin"),
    updateUserRole
  );

module.exports = router;
