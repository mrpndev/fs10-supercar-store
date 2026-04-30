const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

function validateSession(req, res, next) {
	try {
		
		console.log("JWT Token:", req.headers.authorization);
		if (req.method === "OPTIONS") {
			// a preflight request method to check for what's allowed
			// continue if it's the options request
			next();
		}

		// checks if token exists
		if (!req.headers.authorization) {
			throw new Error("Forbidden");
		}

		// sanitizes the token for word Bearer
		const authToken = req.headers.authorization.includes("Bearer")
			? req.headers.authorization.split(" ")[1]
			: req.headers.authorization;

		// const authToken	
		// if (req.headers.authorization.includes("Bearer")) {
		// 	authToken = req.headers.authorization.split(" ")[1]
		// } else {
		// 	authToken = req.headers.authorization
		// }

		// extracts payload
		const payload = jwt.verify(authToken, JWT_KEY);

		// continues to the rest of the code
		next();

	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: `${error.message}`,
		});
	}
}

module.exports = validateSession;
