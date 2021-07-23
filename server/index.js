// NOTE: error responses are sent in JSON format as follows:
// res.send({ error: `error message` });

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use((err, req, res, callback) => {
//     // todo: implement error handling logic and return an appropriate response
//     console.log(`Error: ${err}`);
//     res.status(500).json({ message: `Error: ${err}` });
//     return;
//     // callback();
// })


// Server
app.use('/api/posts', require('./routes/posts'));
app.use('/verifyToken', require('./routes/verifyToken'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));

app.get('/', (req, res) => {
    res.send('<p>API is online</p>');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
