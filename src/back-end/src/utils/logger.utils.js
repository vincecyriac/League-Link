const { createLogger, format, transports } = require('winston');

// Require the `winston-daily-rotate-file` transport
require('winston-daily-rotate-file');

// Create a transport for daily rotating log files
const fileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/server-%DATE%.log', // Include current date in log file name
    datePattern: 'YYYY-MM-DD', // Use this pattern for the date in the log file name
    maxFiles: '100d', // Keep log files for 100 days
});

// Export a logger that logs to the console and to daily rotating log files
const logger = createLogger({
    format: format.combine(
        // Timestamp with format 'MMM-DD-YYYY HH:mm:ss'
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        // Align log messages
        format.align(),
        // Use the log level, timestamp, and message in the log output
        format.printf(info => `\n[${info.level}] :: ${[info.timestamp]} : ${info.message}`),
    ),
    // Use the console and file rotate transports
    transports: [fileRotateTransport],
})


function logAllRequests(req, res, next) {
  console.log(req)
    res.on('finish', () => {
        logger.info(`${res.statusCode} ${res.statusMessage} ${req.method} ${req.originalUrl} ${req.ip} ${req.get('user-agent')}`);
      });
    next();
  }

module.exports = { logger,logAllRequests }