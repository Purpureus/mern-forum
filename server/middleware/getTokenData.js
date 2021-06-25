// Same as authToken but doesn't return an error if access token is invalid

const jwt = require('jsonwebtoken');

function getTokenData(req, res, next) {
	req.jwtData = null;
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return;

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, jwtData) => {
		if (err) return;
		req.jwtData = jwtData;
	});

	next();
}

module.exports = getTokenData;