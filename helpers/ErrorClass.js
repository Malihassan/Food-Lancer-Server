class AppError extends Error {
    constructor(name){
        super();
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError