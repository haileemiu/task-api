const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/tasks');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(express.json());

app.use('/api', require('./routes/api'));

// exeception error handler - only one that takes 4 arguements
app.use((err, req, res, next) => {
    res.status(400).send( { error: err.message } );
});

app.listen(5000, () => console.log('listening on port 5000...'));