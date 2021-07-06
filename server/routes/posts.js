const express = require('express');
const router = express.Router();
const fs = require('fs');
const readFile = require('../functions/readFile');
const authToken = require('../middleware/authToken.js');
const getTokenData = require('../middleware/getTokenData.js');

function log(err) {
    console.log(`Error: ${err}`);
}

function getNextPostId(callback) {
    fs.readFile('db/info.json', (err, data) => {
        if (err) {
            log(err);
            callback(-1);
            return;
        }

        const jsonData = JSON.parse(data);
        const nextId = jsonData.nextId;
        callback(nextId);
    });
}

function setNextPostId() {
    fs.readFile('db/info.json', (err, data) => {
        if (err) {
            log(err);
            return;
        }

        const jsonData = JSON.parse(data);
        jsonData.nextId += 1;

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

router.get('/', (req, res) => {
    readFile('db/posts.json', (data) => {
        const postList = JSON.parse(data).map(post => {
            return {
                postId: post.postId,
                title: post.title,
                author: post.author,
                date: post.date
            };
        });
        return res.json(postList);
    });
});

router.get('/:id', getTokenData, (req, res) => {
    readFile('db/posts.json', (data) => {
        const requestedPost = JSON.parse(data).find(post =>
            post.postId == req.params.id
        );
        if (!requestedPost) {
            res.status(404).json({ message: `Error: post does not exist.` });
            return;
        }

        let canDelete = false;
        if (req.jwtData) {
            const isAuthor = req.jwtData.user.id == requestedPost.authorId;
            const isAdmin = (!isAuthor) &&
                req.jwtData.user.roles &&
                req.jwtData.user.roles.find(role => role == 'admin');

            if (isAuthor || isAdmin) canDelete = true;
        }

        return (res.json({ post: requestedPost, canDelete: canDelete }));
    });
});

router.post('/', authToken, (req, res) => {
    const contentMaxCharCount = 999;
    const titleMaxCharCount = 99;

    if (!req.body.title || !req.body.content) {
        res.status(400).json({ error: `Please include post title and content` });
        return;
    }
    if (req.body.title.length > 99) {
        res.status(400).json({ error: `Post title cannot exceed ${titleMaxCharCount}.` });
        return;
    }
    if (req.body.content.length > 999) {
        res.status(400).json({ error: `Post content cannot exceed ${contentMaxCharCount}.` });
        return;
    }

    readFile('db/posts.json', (data) => {
        const posts = JSON.parse(data);

        getNextPostId((nextId) => {
            if (nextId < 0) {
                const error = `Couldn't get nextPostId`;
                console.log(error);
                return (res.send(error));
            }

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth().toString().padStart(2, '0');
            const day = date.getDay().toString().padStart(2, '0');

            posts.push({
                postId: nextId,
                title: req.body.title,
                content: req.body.content,
                authorId: req.jwtData.user.id,
                author: req.jwtData.user.name,
                date: [month, day, year]
            });

            let writeSuccess = true;

            fs.writeFile('db/posts.json',
                JSON.stringify(posts),
                err => {
                    if (err) {
                        writeSuccess = false;
                        console.log(`Error: ${error}`);
                        return;
                    }
                }
            );
            if (writeSuccess) setNextPostId();
        });

        return (res.status(201).json({ message: `Post created successfully` }));
    });
});

router.delete('/:id', authToken, (req, res) => {
    readFile('db/posts.json', (data) => {
        const posts = [];
        let postToDelete = null;
        JSON.parse(data).forEach(post => {
            if (post.postId == req.params.id) return postToDelete = post;
            posts.push(post);
        });

        const isAuthor = req.jwtData.user.id == postToDelete.authorId;
        const isAdmin = (!isAuthor) &&
            req.jwtData.user.roles &&
            req.jwtData.user.roles.find(role => role == 'admin');

        if (!isAuthor && !isAdmin) {
            res.status(401).json({ error: `You are not authorized to delete this post.` });
            return;
        }

        let writeSuccess = true;
        fs.writeFile(
            'db/posts.json',
            JSON.stringify(posts),
            (err) => {
                if (!err) return;
                writeSuccess = false;
                log(err);
                return;
            }
        );

        if (writeSuccess) {
            return res.json(posts);
        }
    });
});

module.exports = router;
