const cors = require('cors');
const express = require('express');
const path = require('node:path');
const PORT = process.env.PORT || 5500;
let server = express();


server.use(cors());
server.use(express.json())




server.listen(PORT, ()=> {console.log(`http://localhost:${PORT}`)});