const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const readFile = require('../functions/readFile');

router.post('/', (req, res) => {
	const reqName = req.body.username;
	const reqPass = req.body.password;

	if (!reqName || !reqPass) return res.sendStatus(401);

	readFile('db/users.json', data => {
		const user = JSON.parse(data).find(user => user.name === reqName);
		if (!user) {
			return res.status(401).send({ error: `The specified user does not exists.` });
		}
		if (user.pass != reqPass) {
			return res.status(401).send({ error: `The password is incorrect.` });
		}

		const roles = user.roles || null;

		const accessToken = jwt.sign(
			{ user, roles },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30m' }
		);
		res.json({
			username: user.name,
			accessToken: accessToken
		});
	});
});

module.exports = router;
