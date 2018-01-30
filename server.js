'use strict';
const express = require('express'); //Required the express module
const data = require('./db/notes');

const { PORT } = require('./config');
const { logger } = require('./logger');

const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const app = express();
//Created an instance from express module

//Used the built in express module to serve static content from the specified directory
app.use(express.static('public'))
app.use(express.json());
//Get request
app.use(logger);

app.get('/v1/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });

});

app.get('/v1/notes/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      res.json('not found');
    }
  });

});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});


app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});



app.listen(PORT, () => {
  console.log('listening on 8080')
})