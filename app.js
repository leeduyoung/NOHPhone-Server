var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var index = require('./routes/index');
var users = require('./routes/users');

// database(postgres) configuration
var pg = require('pg')
  , session = require('express-session')
  , pgSession = require('connect-pg-simple')(session);
 
app.use(session({
  store: new pgSession({
    pg : pg,                                  // Use global pg-module 
    conString : 'pg://postgres:2831647@localhost:5432/no_handphone', // Connect using something else than default DATABASE_URL env variable 
    tableName : 'session'               // Use another table-name than the default "session" one 
  }),
  secret: '12#$%@#%675&)*(78',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use('/common', index);
app.use('/users', users);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
