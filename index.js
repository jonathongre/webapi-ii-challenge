const express = require('express');
const postRoutes = require('./posts/postRoutes');

const server = express();

server.use(express.json());
server.use('/api/posts', postRoutes);

server.listen(5000, () => {
    console.log(`The server is listening on port 5000`);
})