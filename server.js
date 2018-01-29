'use strict';
const express = require('express'); //Required the express module
const data = require('./db/notes');

const app = express();
//Created an instance from express module

//Used the built in express module to serve static content from the specified directory
app.use(express.static('public'))
//Get request

app.get('/v1/notes', (req, res) => {
  const {searchTerm} = req.query;

  const filteredData = data.filter(item => {
    return item.title.includes(searchTerm);
  });

  (searchTerm) ? res.json(filteredData) : res.json(data);
});

app.get('/v1/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const matchedItem = data.find(item => {
    return item.id === id
  });
  res.json(matchedItem)
});
//Use destrcturing the pluck out the query
//Filter through the data and use .includes to see if it matches the searchterm
//return the iterm being matched


//Use a ternary operator for what to display



//Make use of parse int to parse the id
//using the find method compare the matched item
//display the matched item in a json format


// INSERT EXPRESS APP CODE HERE...

//Set up the server to listen on port 8080
app.listen(8080, () => {
  console.log('listening on 8080')
})