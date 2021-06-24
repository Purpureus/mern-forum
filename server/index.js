// NOTE: error responses are sent in JSON format as follows:
// res.send({ error: `error message` });

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Server
app.use('/api/posts', require('./routes/posts'));
app.use('/login', require('./routes/login'));

app.get('/', (req, res) => {
    res.send('<p>API is working</p>');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
