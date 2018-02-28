const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({extended: true}))

app.listen(3000, function(req, res) {
  console.log('listening on 3000')
})

//app.get('/', function(req, res) {
//  res.send('Hallo allemaal! Wat fijn dat jij er bent')
//})

app.get('/', (req, res) => {
  var index = path.resolve(__dirname + '/../public/index.html');
  res.sendFile(index);
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

app.post('/quotes', (req, res) => {
  console.log(req.body)
})
