var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

var routes = require('./routes/index');
var classes = require('./routes/classes')

var redis = require('redis')
var RedisStore = require('connect-redis')(session)
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var flash = require('connect-flash')
var db = require('./models')

var app = express();

var redisClient;
if (process.env.REDISTOGO_URL) {
  var rtg = url.parse(process.env.REDISTOGO_URL);
  var redisClient = redis.createClient(rtg.port, rtg.hostname);

  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = redis.createClient();
}


var redisSession = session({secret: '1234567890QWERTY', 
  store: new RedisStore({
    client: redisClient      
  }),
  resave: false,
  saveUninitialized: false
});  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(multer());
app.use(flash());
app.use(redisSession);
app.use(passport.initialize());
app.use(passport.session());  
app.use(express.static(path.join(__dirname, 'public')));

var authWhitelists = {
  "GET":  ["/js", "/stylesheets", "/img", "/log", "/auth"],
  "POST": [],
  "PUT": []
}

function checkAuthWhitelist(url, authWhitelist) {    
   for(var i = 0; i < authWhitelist.length; i++) {
        if(!!url.match(new RegExp("^" + authWhitelist[i]))) {
            console.log(url + " does not require auth")
            return false
        }
    }    
    return true
} 

app.use(function(req, res, next) {  
  if (!checkAuthWhitelist(req.url, authWhitelists[req.method]) || req.user) {
    next();
  } else {
    res.redirect("/login");
  }  
});

app.use(function(req, res, next){
    res.locals.successMessages = req.flash('successMessages');
    res.locals.errorMessages = req.flash('errorMessages') + req.flash('error');
    next();
});


passport.serializeUser(function(user, done) {    
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {  
  db.User.findById(id).then(function(user, err) {
    return done(null, user)
  }).catch(function(err){
    return done(err)
  })
})


var googleAuthDomain = "www.betahipster.com";
var domainOverride = process.env.GOOGLE_AUTH_DOMAIN;
if (domainOverride) {
  googleAuthDomain = domainOverride;
}

var callbackUrl = "http://betahipster.com/auth/google/callback"
var callbackOverride = process.env.GOOGLE_CALLBACK_URL;
if (callbackOverride) {
  callbackUrl = callbackOverride
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackUrl
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
     db.User.findOne({where: {googleId: profile.id}}).then(function(user) {
      if (user) {        
        done(null, user);
      } else {                
        db.User.create({googleId: profile.id, displayName: profile.displayName}).then(function(user){                                          
          done(null, user)                    
        }).catch(function(err) {
          done(err, null)          
        })    
      }
    });       
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

app.get("/login", function(req, res) {
  res.render('login')
})

app.use(routes);
app.use(classes);

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
