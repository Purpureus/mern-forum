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
		res.status(403).json({ error: `You must provide a username and password` });
		return;
	}
	if (username.length < 8) {
		res.status(403).json({ error: `Username is too short` });
		return;
	}
	if (password.length < 8) {
		res.status(403).json({ error: `Password is too short` });
		return;
	}
	if (username.length > 99) {
		res.status(403).json({ error: `Username is too long` });
		return;
	}
	if (password.length > 99) {
		res.status(403).json({ error: `Password is too long` });
		return;
	}

	readFile('db/users.json', data => {
		const users = JSON.parse(data);
		if (users.find(user => user.name == username)) {
			res.status(400).json({ error: `That username already exists.` });
			return;
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
			res.status(201).json({ message: `User created!!` });
		});
	});
});

module.exports = router;