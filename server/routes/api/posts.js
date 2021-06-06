const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`)
            res.json({
                status: 404,
                msg: err
            });
            return;
        }

        res.json(JSON.parse(data));
    });
});

router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        title: `Post number ${req.params.id}`,
        content: `Bla bla bla`
    });
});

router.post('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`)
            return (res.json({
                status: 404,
                msg: err
            }));
        }

        if (!req.body.title || !req.body.content) {
            return (res.send('Error: please include post title and content'));
        }

        const posts = JSON.parse(data);
        posts.push({
            id: posts.length,
            title: req.body.title,
            content: req.body.content,
            author: "Guest"
        });

        fs.writeFile(
            'db/posts.json',
            JSON.stringify(posts),
            (err) => `Error: ${err}`);

        return (res.json(JSON.parse(data)));
    });
});

module.exports = router;
