// const path = require('node:path');
// const { cloudinary } = require('cloudinary').v2;
const Groceries = require('./models/groceries');

require('dotenv').config();

const bcrypt = require('bcrypt');

const cors = require('cors');
const express = require('express');
let server = express();
//
const PORT = process.env.PORT || 5500;
//
server.use(cors());
server.use(express.json({ limit: '100mb' }));
//ניתוב
server.use('/api/users', 		require('./routes/users.route'));
server.use('/api/groceries', 	require('./routes/groceries.route'));
server.use('/api/shoppinglist', require('./routes/shoppinglist.route'));
server.use('./api/upload', 		require('./routes/upload.route'))

Groceries.InitIndexCount().then(() => {
	server.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });
});


