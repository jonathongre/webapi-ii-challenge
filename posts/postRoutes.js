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

//Get Comments
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    db.findPostComments(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't retrieve Comments"})
    })
});

//Post - add new posts
router.post('/', (req, res) => {
    const newPost = req.body
    if (newPost.title && newPost.contents) {
        db.insert(newPost)
            .then(postNew => {
                db.find()
                    .then(posts => {
                        res.json(posts)
                    })
            })
            .catch(err => {
                res.status(400).json({ error: 'Please provide title and contents for the post.'})
            })
    }
})

//Post Comments
router.post('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(result => {
      if (result.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (!req.body.text || !req.body.text.trim()) {
          res
            .status(400)
            .json({
              message: "Please provide 'text' field to create comment."
            });
        } else {
          const comment = {
            text: req.body.text,
            post_id: req.params.id
          };
          
            db.insertComment(comment)
            .then(val => {
              res.status(201).json(comment);
            })
            .catch(err => {
              res
                .status(500)
                .json({
                  message:
                    "A server server error occured when saving the comment to the database."
                });
            });
        }
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message: "There was an error looking up a post with the specified ID"
        });
    });
});

//Put - update post
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const postUpdate = req.body;
    if (postUpdate.title || postUpdate.contents) {
        db.update(id, postUpdate)
            .then(isUpdated => {
                if (isUpdated) {
                    db.findById(id)
                        .then(post => {
                            res.json(post);
                        });
                } else {
                    res.status(404).json({ message: "The post with that ID not found." });
                }
            }).catch(err => {
                res.status(500).json({ error: "That post could not be updated." });
            });
    } else {
        res.status(400).json({ errorMessage: "Title and contents required." });
    }
})

//Delete a post
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
        const deletedPost = post;
        db.remove(id)
            .then(countDeleted => {
                if (countDeleted) {
                    db.find()
                    .then(posts => {
                        res.json(posts);
                    })
                } else {
                    res.status(404).json({ message: 'The post with that ID not found.' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: 'That post could not be deleted.' });
            })
    }).catch(err => {
        res.status(500).json({ error: 'Could not get post.' });
    })
});


module.exports = router; 