const express = require('express');
const uuid = require('uuid');
const router = express.Router();
// const posts = require('../../posts');
const fs = require('fs');

router.get('/', (req, res) => {
    // res.json(posts);
    const posts = [];

    fs.readFile('../../db/posts.json', (err, data) => {
	if(err) {
	    console.log('OUT! SCHOOL PRISON!');
	    return;
	}
	posts = JSON.parse(data);
	res.json(posts);
    });
    
});

router.get('/:id', (req, res) => {
    // res.json(posts.filter(post => post.id === parseInt(req.params.id)));
});

router.post('/', (req, res) => {
    const newPost = {
	id: uuid.v4(),
	title: req.body.title,
	content: req.body.content
    };

    if(!newPost.title || !newPost.content) {
	return( res.status(400).json({ msg: "Please include post title and content" }) );
    }

    // posts.push(newPost);
    // res.json(posts);
});

module.exports = router;
