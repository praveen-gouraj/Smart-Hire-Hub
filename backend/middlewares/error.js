class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle common known errors from Mongoose/JWT and normalize to our ErrorHandler
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
  }
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} Entered`,
      400
    );
  }
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Json Web Token is invalid, Try again!", 400);
  }
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json Web Token is expired, Try again!", 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
