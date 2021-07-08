const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const readFile = require('../functions/readFile');

router.post('/', (req, res) => {
	const reqName = req.body.username;
	const reqPass = req.body.password;

	if (!reqName || !reqPass) {
		return res.status(403).json({ error: `You must provide a name and password` });
	}

	readFile('db/users.json', data => {
		const user = JSON.parse(data).find(user => user.name === reqName);
		if (!user || user.pass != reqPass) {
			return res.status(400).json({ error: `Wrong username or password.` });
		}

		let loginDuration = '10m';
		switch (req.body.loginDuration) {
			case '10m': loginDuration = '10m'; break;
			case '30m': loginDuration = '30m'; break;
			case '1h': loginDuration = '1h'; break;
			case '2h': loginDuration = '2h'; break;
			case '1d': loginDuration = '1d'; break;
			default: loginDuration = '10m';
		}

		const accessToken = jwt.sign(
			{ user },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: loginDuration }
		);
		res.json({
			username: user.name,
			accessToken: accessToken
		});
	});
});

module.exports = router;
