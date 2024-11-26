const catchAsyncError = require("../middleware/catchAsyncError");
const AuditLog = require("../models/AuditLog");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// superadmin -> get all users and admin
const getAllAdmins = catchAsyncError(async (req, res, next) => {
  try {
    const admins = await User.find({
      role: { $nin: ["superadmin", "user"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// admin -> get all users
const getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.find({
      role: { $nin: ["admin", "superadmin"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const assignPermission = catchAsyncError(async (req, res, next) => {
  const { userId, permissions, status } = req.body;
  const user = await User.findById(userId);
  if (!user || user.role !== "admin") {
    return next(new ErrorHandler("user not found", 404));
  }

  const grantedPermissions = [];
  const revokedPermissions = [];

  for (const key in permissions) {
    if (permissions[key] !== user.permissions[key]) {
      if (permissions[key]) {
        grantedPermissions.push(key);
      } else {
        revokedPermissions.push(key);
      }
    }
  }

  if (
    grantedPermissions.length === 0 &&
    revokedPermissions.length === 0 &&
    !status
  ) {
    return res.status(400).json({
      success: false,
      message: "No changes in permissions",
    });
  }

  user.permissions = { ...user.permissions, ...permissions };

  if (status && status !== user.status) {
    user.status = status;
  }

  await user.save();

  let actionDescription = `Updated permissions: `;
  if (grantedPermissions.length > 0) {
    actionDescription += `"${grantedPermissions.join('", "')}" granted`;
  }
  if (revokedPermissions.length > 0) {
    if (grantedPermissions.length > 0) actionDescription += ` and `;
    actionDescription += `"${revokedPermissions.join('", "')}" revoked`;
  }

  if (status && status !== user.status) {
    actionDescription += `; Status changed to "${status}"`;
  }

  actionDescription += ` for admin (username: ${user.username}).`;

  await AuditLog.create({
    action: actionDescription,
    performedBy: req.user._id,
    affectedUser: user._id,
  });

  res.status(200).json({
    success: true,
    message: `Permissions and status updated successfully`,
  });
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const admin = await User.findById(req.user._id);
  if (!admin || !admin.permissions.delete) {
    return next(
      new ErrorHandler("You don't have permission to delete users", 403)
    );
  }

  await User.findByIdAndDelete(userId);

  const actionDescription = `Deleted user (username: ${user.username}, userId: ${user._id})`;

  await AuditLog.create({
    action: actionDescription,
    performedBy: req.user._id,
    affectedUser: user._id,
  });

  res.status(200).json({
    success: true,
    message: `User deleted successfully`,
  });
});

const blockOrUnblockUser = catchAsyncError(async (req, res, next) => {
  const { userId, status } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (status === "blocked") {
    if (user.status === "blocked") {
      return next(new ErrorHandler("User is already blocked", 400));
    }
    user.status = "blocked";
  } else if (status === "active") {
    if (user.status === "active") {
      return next(new ErrorHandler("User is already active", 400));
    }
    user.status = "active";
  } else {
    return next(new ErrorHandler("Invalid action provided", 400));
  }

  await user.save();

  const actionDescription = `${
    status === "blocked" ? "Blocked" : "Activated"
  } user (username: ${user.username})`;

  await AuditLog.create({
    action: actionDescription,
    performedBy: req.user._id,
    affectedUser: user._id,
  });

  res.status(200).json({
    success: true,
    message: `User ${
      status === "blocked" ? "blocked" : "activated"
    } successfully`,
  });
});

const updateUserRole = catchAsyncError(async (req, res, next) => {
  const {  username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields (Username, and role) are required.",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    { username, role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    user: updatedUser,
  });
});

module.exports = {
  getAllAdmins,
  getAllUsers,
  assignPermission,
  deleteUser,
  blockOrUnblockUser,
  updateUserRole,
};
