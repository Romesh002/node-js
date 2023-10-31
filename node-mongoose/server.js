require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');           // For connecting to the database npm install --save mongoose, Connected with mongodb as DRM.
const session = require('express-session');     //For using the express session npm install --save express-session
const mongoDbStore = require('connect-mongodb-session')(session);  //For storing the session on  database  npm install --save connect-mongodb-session
const csrf = require('csurf');
const flash = require('connect-flash');


// const rootDir = require('./utils/path')

const app = express();
const store = new mongoDbStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
const errorController = require('./controllers/error');
// const mongoConnect = require('./utils/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const ShopRoutes = require('./routes/shop');
const AuthRoutes = require('./routes/auth');
const port = 5000;

const UserModel = require('./models/userModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    UserModel.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(ShopRoutes);
app.use(AuthRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        // console.log(result);
        app.listen(port);
    }).catch(err => {
        console.log(err);
    });

