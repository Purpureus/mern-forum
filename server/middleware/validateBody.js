
function validateBody(error, req, res, next) {
	if (JSON.stringify(req.body) != "{}") {
		try {
			JSON.parse(JSON.stringify(req.body));
		}
		catch (error) {
			if (error) {
				res.status(400).send({ message: `Invalid request` });
				return;
			}
		}
	}

	next();
}

module.exports = validateBody;