// const path = require('node:path');
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 5500;
let server = express();

server.use(cors());
server.use(express.json())

//ניתוב
server.use('/api/users', 		require('./routes/users.route'));
server.use('/api/groceries', 	require('./routes/groceries.route'));
server.use('/api/shoppinglist',	require('./routes/shoppinglist.route'));

server.listen(PORT, ()=> {console.log(`http://localhost:${PORT}`)});