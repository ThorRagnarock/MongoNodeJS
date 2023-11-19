const path = require('path');
// const { cloudinary } = require('cloudinary').v2;
require('dotenv').config();

// const bcrypt = require('bcrypt');
const cors = require('cors');

const express = require('express');
let server = express();
//
const PORT = process.env.PORT || 5500;
//
server.use(cors());
server.use(express.json({ limit: '100mb' }));

server.use(express.static(path.join(__dirname, 'client', 'dist')));
//ניתוב
server.use('/api/users', 		require('./routes/users.route'));
server.use('/api/groceries', 	require('./routes/groceries.route'));
server.use('/api/shoppinglist', require('./routes/shoppinglist.route'));
server.use('/api/upload', 		require('./routes/upload.route'))

server.get('/*', async (req, res) => {
	try {
		res.status(200).sendFile(path.join(__dirname,'client', 'dist', 'index.html'));
	} catch (error) {
		res.status(500).json({ error });
	}
});

	server.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });
