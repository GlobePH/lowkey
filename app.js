const express = require('express');
const hbs = require('hbs');
const path = require('path');
const http = require('http');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const config = require('./config/config')
const {mongoose} = require('./database/mongoose');


//controllers
const userController = require('./controllers/userController');
const pageController = require('./controllers/pageController');
const apiController = require('./controllers/apiController');

//basic configurations
var app = express();
var port = process.env.PORT || config.PORT;
var server = http.createServer(app);
var session;

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({ resave: true, saveUninitialized: true, secret: config.SECRET }));
app.use(flash());
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use('/public/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/public/css', express.static('node_modules/animate.css/'));
app.use('/public/js', express.static('node_modules/bootstrap/dist/js'));
app.use('/public/js', express.static('node_modules/jquery/dist'));
app.use('/public/js', express.static('node_modules/tether/dist/js'));

//partials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/partials/auth');
hbs.registerPartials(__dirname + '/views/partials/misc');
hbs.registerPartials(__dirname + '/views/partials/pages');
hbs.registerPartials(__dirname + '/views/partials/subpages');
hbs.registerPartials(__dirname + '/views/partials/tabpages');
hbs.registerHelper('shorten', (text) => {
  var maxLength = 150;
  var trimmedString = text.substr(0, maxLength);
  trimmedString =trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  return trimmedString;
});


//routes
app.get('/', pageController.getHomepage);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/logout', pageController.getLogout);
app.get('/community', pageController.getCommunity);
app.get('/mycourses', pageController.getMyCourses);
app.get('/myprofile', pageController.getMyProfile);
app.get('/course', pageController.getCoursesNoParam);
app.get('/course/:id', pageController.getCoursesWithParam);
app.get('/upload', pageController.getUploadCourse);
app.post('/upload', pageController.postUploadCourse);
app.get('/myuploads', pageController.getMyUploads);
app.get('/myuploads/:id', pageController.getEditUpload);
app.post('/myuploads/:id', pageController.postEditUpload);
app.get('/watch/:id',pageController.getWatch);
app.get('/start/:id', pageController.getStartCourse);
app.get('/enrolled/:id', pageController.getEnrolledCourse);
app.get('/community/create', pageController.getCreateThread);
app.post('/community/create', pageController.postCreateThread);

//api
app.get('/api/getmagnet/:id', apiController.getMagnetApi);

//404 route
app.use(function(req, res) {
    res.status(404).end('404');
});

//listen
server.listen(port, () => { console.log(`Server is running on port ${port}`); });

module.exports = { app };
