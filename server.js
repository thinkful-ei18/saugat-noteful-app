'use strict';
const express = require('express'); //Required the express module
const morgan = require('morgan');
const notesRouter = require('./router/notes.router');
const { PORT } = require('./config');

const app = express();



app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.use('/v1', notesRouter);

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