const express = require("express");
const { getAllAuditLogs } = require("../controllers/AuditLogController");
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/superadmin/all-audit-logs",
  isAuthenticatedUser,
  authorizeRole("superadmin"),
  getAllAuditLogs
);

module.exports = router;
