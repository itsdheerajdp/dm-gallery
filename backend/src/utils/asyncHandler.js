// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
//     }
// };

// or

// const asyncHandler = (func) => {
//     () => {} };
// or
const asyncHandler = (func) => async(req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        // console.log("ITs error",error)
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}; // taking function as parameter

export { asyncHandler };