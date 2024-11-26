const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorMiddleware = require("./middleWare/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const auth = require("./routes/authRoutes");
const user = require("./routes/userRoutes");
const auditLogs = require("./routes/AuditLogRoutes");


// routes
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/auditLogs", auditLogs);

//Middleware for Error
app.use(errorMiddleware);

module.exports = app;
