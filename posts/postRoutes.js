const express = require('express');

const router = express.Router();

const db = require('../data/db');

//Get posts
router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not get posts." });
        });
});

//Get posts by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
        if (post.length) {
            res.json(post);
        } else {
            res.status(404).json({ message: "The post with that ID not found." });
        }
    }).catch(err => {
        res.status(500).json({ error: "Could not get posts." });
    });
});


module.exports = router; 