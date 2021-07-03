const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const readFile = require('../functions/readFile');

router.post('/', (req, res) => {
	const reqName = req.body.username;
	const reqPass = req.body.password;

	if (!reqName || !reqPass) {
		return res.send(403).send({ error: `You must provide a name and password` });
	}

	readFile('db/users.json', data => {
		const user = JSON.parse(data).find(user => user.name === reqName);
		if (!user || user.pass != reqPass) {
			return res.status(400).send({ error: `Wrong username or password.` });
		}

		const accessToken = jwt.sign(
			{ user },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10s' }
		);
		res.json({
			username: user.name,
			accessToken: accessToken
		});
	});
});

module.exports = router;
