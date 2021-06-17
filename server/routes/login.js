const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
	const username = req.body.username;
	const user = {
		name: username
	};
	const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
	res.json({ accessToken: accessToken });
});

module.exports = router;
