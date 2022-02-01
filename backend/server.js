const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer')
const fileUploader = require('./controllers/fileUploader');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({dest:'./tmp/'});

app.use(cors());
app.use(express.json());

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

let db=admin.firestore();
let a=db.collection('users');

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
app.get('/',(req,res)=>res.send("hello world"))
/*app.post('/samz/post', upload.single('file'), function (req, res, next) {
    // req.files is array of uploaded files
    // req.body will contain the text fields, if there were any
    console.log(req.file);
    res.send("hello world");
  });*/
app.post('/samz/post',upload.single('file'),fileUploader.uploadFile);


