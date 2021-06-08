const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
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
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
            res.json({
                status: 404,
                msg: err
            });
            return;
        }

        res.json(JSON.parse(data).find(post => post.id == req.params.id));
    });
});

router.post('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
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
            (err) => `Error: ${err}`
        );

        return (res.json(JSON.parse(data)));
    });
});

router.delete('/:id', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
            return (res.json({
                status: 404,
                msg: err
            }));
        }


        const posts = JSON.parse(data);
        const newPosts = posts.filter(post => post.id != req.params.id);

        fs.writeFile(
            'db/posts.json',
            JSON.stringify(newPosts),
            (err) => `Error: ${err}`
        );

        res.json(newPosts);
    });
});

module.exports = router;
