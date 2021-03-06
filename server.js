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


// Listen for incoming connections
if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}
module.exports = app; // Export for testing
