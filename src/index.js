const path = require('path')
const express = require('express');
const app = express();
const public_dir_path = path.join(__dirname, '../public');

app.use(express.static(public_dir_path));

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})

