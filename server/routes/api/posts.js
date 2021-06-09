const express = require('express');
const router = express.Router();
const fs = require('fs');

function getNextPostId(returnFn) {
    fs.readFile('db/info.json', (err, data) => {
        if (err) {
            console.log(`Error in getNextPostId - fs.readFile`);
            returnFn(-1);
            return;
        }

        const jsonData = JSON.parse(data);
        const nextId = jsonData.nextId;
        returnFn(nextId);
    });
}

function setNextPostId() {
    fs.readFile('db/info.json', (err, data) => {
        if (err) {
            console.log(`Error in setNextPostId - readFile`);
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
                console.log(`Error on setNextPostId - fs.writeFile`);
            }
        );
    });
}

router.get('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error on router.get - fs.readFile`);
            return;
        }

        return (res.json(JSON.parse(data)));
    });
});

router.get('/:id', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error on router.get - fs.readFile`)
            return;
        }

        return (
            res.json(JSON.parse(data).find(
                post => post.postId == req.params.id
            ))
        );
    });
});

router.post('/', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error on router.post - fs.readFile`)
            return;
        }

        if (!req.body.title || !req.body.content) {
            return (res.send('Error: please include post title and content'));
        }

        const posts = JSON.parse(data);
        getNextPostId((nextId) => {
            if (nextId < 0) {
                const error = `Couldn't get nextPostId`;
                console.log(error);
                return (res.send(error));
            }
            posts.push({
                postId: nextId,
                title: req.body.title,
                content: req.body.content,
                author: "Guest"
            });

            let writeSuccess = true;

            fs.writeFile(
                'db/posts.json',
                JSON.stringify(posts),
                (err) => {
                    if (!err) return;
                    writeSuccess = false;
                    console.log(`Error in router.post - fs.writeFile: ${err}`)
                    return;
                }
            );

            if (writeSuccess) {
                setNextPostId();
            }
        });

        return (res.json(JSON.parse(data)));
    });
});

router.delete('/:id', (req, res) => {
    fs.readFile('db/posts.json', (err, data) => {
        if (err) {
            console.log(`Error in router.delete - fs.readFile`)
            return;
        }

        const posts = JSON.parse(data);
        const newPosts = posts.filter(post => post.postId != req.params.id);
        let writeSuccess = true;

        fs.writeFile(
            'db/posts.json',
            JSON.stringify(newPosts),
            (err) => {
                if (!err) return;
                writeSuccess = false;
                console.log(`Error on router.delete - fs.writeFile`)
                return;
            }
        );

        if (writeSuccess) {
            return (res.json(newPosts));
        }
    });
});

module.exports = router;
