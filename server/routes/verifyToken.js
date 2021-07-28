const express = require('express');
const router = express.Router();
const getTokenData = require('../middleware/getTokenData.js');

router.get('/', getTokenData, (req, res) => {
	console.log(`User is trying to verify a token`);
	res.json(req.jwtData
		? { accessTokenValid: true }
		: { accessTokenValid: false }
	);
});

module.exports = router;