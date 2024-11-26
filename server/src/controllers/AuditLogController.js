const AuditLog = require("../models/AuditLog");
const catchAsyncError = require("../middleware/catchAsyncError");

const getAllAuditLogs = catchAsyncError(async (req, res) => {
  const auditLogs = await AuditLog.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    auditLogs,
  });
});

module.exports = {
  getAllAuditLogs,
};
