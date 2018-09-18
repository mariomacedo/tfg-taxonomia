const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

// static folder
app.use(express.static('views/resources'));

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
    console.log('Live @ MongoDb as well!');
});

// create home route
app.get('/', (req, res) => {
    res.render('pages/home', { user: req.user });
});

app.listen(8080, () => {
    console.log('We are live @ :8080');
});
