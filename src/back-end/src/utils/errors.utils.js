// Define a base error class with a custom error code
class GeneralError extends Error {
    constructor(message, errorCode) {
      // Call the parent constructor with the error message
      super(message);
      // Set the error code for the error instance
      this.errorCode = errorCode;
    }
  
    // Method to get the error code
    getCode() {
      if (this instanceof BadRequestException) {
        return 400;
      } else if (this instanceof NotFoundException) {
        return 404;
      } else if (this instanceof ForbiddenException) {
        return 403;
      } else if (this instanceof UnauthorizedException) {
        return 401;
      }
      // If the error is not a known exception, return the custom error code
      return this.errorCode;
    }
  }
  
  // Define custom exceptions that inherit from the base error class
  class BadRequestException extends GeneralError {}
  class NotFoundException extends GeneralError {}
  class ForbiddenException extends GeneralError {}
  class UnauthorizedException extends GeneralError {}
  
  // Export all the error classes for use in other modules
  module.exports = { GeneralError, BadRequestException, NotFoundException, ForbiddenException, UnauthorizedException };
  