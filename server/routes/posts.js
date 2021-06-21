const express = require('express');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const readFile = require('../functions/readFile');
const authToken = require('../middleware/authToken.js');

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
            nextId = -1;
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
        return (res.json(JSON.parse(data)));
    });
});

router.get('/:id', authToken, (req, res) => {
    if (!req.user.roles.find(role => role == 'admin')) {
        res.send(401, { error: `Unauthorised` });
        return;
    }

    readFile('db/posts.json', (data) => {
        const requestedPost = JSON.parse(data).find(post =>
            post.postId == req.params.id
        );
        if (!requestedPost) {
            res.status(404).send({
                message: `Error: post does not exist.`
            });
            return;
        }
        return (res.json(requestedPost));
    });
});

router.post('/', authToken, (req, res) => {
    // TODO: Limit char count
    if (!req.body.title || !req.body.content) {
        return (res.send('Error: please include post title and content'));
    }

    readFile('db/posts.json', (data) => {
        const posts = JSON.parse(data);

        getNextPostId((nextId) => {
            if (nextId < 0) {
                const error = `Couldn't get nextPostId`;
                console.log(error);
                return (res.send(error));
            }

            console.log(req.jwtData.user);

            posts.push({
                postId: nextId,
                title: req.body.title,
                content: req.body.content,
                authorId: req.jwtData.user.id,
            });

            let writeSuccess = true;

            fs.writeFile(
                'db/posts.json',
                JSON.stringify(posts),
                err => {
                    if (!err) return;
                    writeSuccess = false;
                    log(err);
                    return;
                }
            );

            if (writeSuccess) setNextPostId();
        });

        return (res.status(201).json({ message: `Post created successfully` }));
    });
});

router.delete('/:id', (req, res) => {
    readFile('db/posts.json', (data) => {

        const posts = JSON.parse(data).filter(post => post.postId != req.params.id);
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
            return (res.json(posts));
        }
    });
});

module.exports = router;
