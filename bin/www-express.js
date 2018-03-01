const express = require('express');
const path = require('path');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

var db;

MongoClient.connect('mongodb://127.0.0.1/crudapp', (err, client) => {
  if (err) return console.log(err);
  db = client.db('crudapp');
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

//app.listen(3000, function(req, res) {
//  console.log('listening on 3000')
//});

//app.get('/', function(req, res) {
//  res.send('Hallo allemaal! Wat fijn dat jij er bent')
//})

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray(function(err, result) {
    var render = path.resolve(__dirname + '/../views/index.ejs');
    res.render(render, {quotes: result});
  });
  //var index = path.resolve(__dirname + '/../public/index.html');
  //res.sendFile(index);
  
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/');
    })
});
