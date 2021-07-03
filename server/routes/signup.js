const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const readFile = require('../functions/readFile');

function getNextUserId(callback) {
	fs.readFile('db/info.json', (err, data) => {
		if (err) {
			callback(-1);
			return;
		}

		const jsonData = JSON.parse(data);
		const nextUserId = jsonData.nextUserId;
		callback(nextUserId);
	});
}
function setNextUserId() {
	fs.readFile('db/info.json', (err, data) => {
		if (err) {
			log(err);
			return;
		}

		const jsonData = JSON.parse(data);
		jsonData.nextUserId += 1;

		fs.writeFile(
			'db/info.json',
			JSON.stringify(jsonData),
			(err) => {
				if (!err) return;
				log(err);
			}
		);
	});
}

router.post('/', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.send(403).send({ error: `You must provide a username and password` });
	}

	readFile('db/users.json', data => {
		const users = JSON.parse(data);
		if (users.find(user => user.name == username)) {
			return res.status(401).send({ error: `That username already exists.` });
		}
		getNextUserId((userId) => {
			users.push({
				id: userId,
				name: username,
				pass: password
			});
			let writeSuccess = true;

			fs.writeFile('db/users.json',
				JSON.stringify(users),
				err => {
					if (err) {
						writeSuccess = false;
						console.log(`Error: ${error}`);
						return;
					}
				}
			);
			if (writeSuccess) setNextUserId();
			res.send(`User created!!`);
		});

	});
});

module.exports = router;