const jwt = require('jsonwebtoken');

function authToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) {
		console.log('No auth token sent');
		return res.status(401).send({ error: `No authentication token sent.` });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send({ error: `Authentication token invalid.` });
		req.jwtData = user;
		next();
	});
}

module.exports = authToken;