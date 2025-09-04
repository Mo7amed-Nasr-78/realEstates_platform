import status from '../constants.js';

// Error middleware that is charge of handling errors
const errorHandling = (error, req, res, next) => {

	if (error.name === 'ValidationError') {
		const errors = Object.values(error.errors).map(e => ({
			field: e.path,
			message: e.message
		}));
		return res.status(400).json({ errors });
	}
	
	if (error.name === "JsonWebTokenError") {
		return res.status(400).json({ status: 400, message: error.message });
	}

	if (error.name === "TokenExpiredError") {
		return res.status(403).json({ status: 403, message: 'Something went wrong, try again' });
	}

	const statusCode = res.statusCode ? res.statusCode : 500;
	res.status(statusCode);
	switch (statusCode) {
		case status.NOT_FOUND:
			res.json({
				status: statusCode,
				title: "Not found",
				message: error.message,
			});
			break;
		case status.NO_CONTENT:
			res.json({
				status: statusCode,
				title: "No Content",
				message: error.message,
			});
			break;
		case status.BAD_REQUEST:
			res.json({
				status: statusCode,
				title: "Bad Request",
				message: error.message,
			});
			break;
		case status.UNAUTHORIZED:
			res.json({
				status: statusCode,
				title: "Unauthorized",
				message: error.message,
			});
			break;
		case status.FORBIDDEN:
			res.json({
				status: statusCode,
				title: "Forbidden",
				message: error.message,
			});
			break;
		case status.INTERNAL_SERVER_ERROR:
			res.json({
				status: statusCode,
				title: "Internal server error",
				message: error.message,
				// stackTrace: error.stack,
			});
			break;
		// default:
		// 	break;
	}
	
};

export default errorHandling;
