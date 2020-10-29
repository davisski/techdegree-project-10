"use strict";

/**
 * Load modules
 */
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require('cors');
const { sequelize } = require("./models");


/**
 * @const {enableGlobalErrorLogging} - Variable to enable global error logging.
 */
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

/**
 * @constant {app} - Create the Express app.
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/build")))
/**
 * Setup morgan which gives us http request logging.
 */
app.use(morgan("dev"));

/**
 * @requires {routes} - Store routes into routes variable.
 */
const routes = require("./routes");
/**
 * Use routes.
 */
app.use("/api", routes);

/**
 * Not found error handler.
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

/**
 * Global error handler.
 */
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
});

/**
 * Set application port
 */
app.set("port", process.env.PORT || 5000);

(async () => {
  await sequelize.authenticate();
  try {
    console.log("Connection to database successful!");
  } catch (error) {
    console.error(error);
  }
})();

// sync model schema to database
sequelize.sync().then(() => {
  const server = app.listen(app.get("port"), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
});
