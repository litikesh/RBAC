const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    },
  });
};

module.exports = sendToken;
