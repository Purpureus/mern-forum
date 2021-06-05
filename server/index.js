const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Server
app.use('/api/posts', require('./routes/api/posts'));

app.get('/', (req, res) => {
    res.send('<p>API is working</p>');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
