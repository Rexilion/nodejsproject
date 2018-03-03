const express = require('express');
const path = require('path');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
var publicpath = path.resolve(__dirname + '/../');
app.use(express.static(publicpath));

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

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})

// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Access the session as req.session
app.get('/cookietest', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
