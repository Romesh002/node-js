const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// const rootDir = require('./utils/path')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const ShopRoutes = require('./routes/shop');
const port = 5000;

const UserModel = require('./models/userModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.use((req, res, next) => {
    UserModel.findById('651fb5d5bf8c4e95286ae865').then(user => {
        req.user = new UserModel(user.username, user.email, user.cart, user._id);
        next();
    }).catch(err => {
        console.log(err);
    })
});


app.use('/admin', adminRoutes);
app.use(ShopRoutes);

app.use(errorController.get404);

mongoConnect(client => {
    console.log(client);
    app.listen(port);
})

