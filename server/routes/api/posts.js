const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
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
    // res.json(posts.filter(post => post.id === parseInt(req.params.id)));
    res.json({
        id: req.params.id,
        title: `Post number ${req.params.id}`,
        content: `Bla bla bla`
    });
});

router.post('/', (req, res) => {
    const newPost = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content
    };

    if (!newPost.title || !newPost.content) {
        return (res.status(400).json({ msg: "Please include post title and content" }));
    }

    // posts.push(newPost);
    // res.json(posts);
});

module.exports = router;
