const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Server
app.use('/api/posts', require('./routes/api/posts'));

app.get('/', (req, res) => {
    res.send('<p>API is working</p>');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
