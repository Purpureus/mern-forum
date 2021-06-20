const fs = require('fs');

function readFile(url, then) {
	fs.readFile(url, (err, data) => {
		if (err) {
			log(err);
			return;
		}
		then(data);
	});
}

module.exports = readFile;