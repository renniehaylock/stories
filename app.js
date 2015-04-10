var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');   

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/home', function(req, res) {
    res.sendFile(__dirname + '/public/home.html');
});

// define model =========================
mongoose.connect('mongodb://heroku_app35736222:7ot4ip3pmb00hv1429rvmvqu58@ds061601.mongolab.com:61601/heroku_app35736222?replicaSet=rs-ds061601');
var Member = mongoose.model('Member', {
        name : String,
        fbid : String,
        email : String,
        gender : String,
        link : String,
        first_name : String,
    });

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all members
app.get('/members', function(req, res) {

    // use mongoose to get all members in the database
    Member.find(function(err, members) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(members); // return all members in JSON format
    });
});

// create member and send back all members after creation
app.post('/members', function(req, res) {
    // Make sure member does not exist
    Member.findOne({ 'fbid': req.body.fbid }, {name: 1, fbid: 1, email: 1, gender: 1, link: 1, first_name: 1}, function (err, member) {
        if (member) {
            console.log('%s is already in the database', member.name) // Space Ghost is a talk show host.
            res.json(member);
        } else {
            // create a member, information comes from AJAX request from Angular
            Member.create({
                name : req.body.name,
                fbid : req.body.fbid,
                email : req.body.email,
                gender : req.body.gender,
                link : req.body.link,
                first_name : req.body.first_name,

            }, function(err, member) {
                if (err) res.send(err);
                // Return the member we just created
                res.json(member);
            });
        }
    });
});

// delete a member
app.delete('/members/:member_id', function(req, res) {
    Member.remove({
        _id : req.params.member_id
    }, function(err, member) {
        if (err)
            res.send(err);

        // get and return all the members after you create another
        Member.find(function(err, members) {
            if (err)
                res.send(err)
            res.json(members);
        });
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
