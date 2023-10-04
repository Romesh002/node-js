const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// const rootDir = require('./utils/path')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const errorController = require('./controllers/error');

const sequelize = require('./utils/database');

const ProductModel = require('./models/productModel');
const UserModel = require('./models/userModel');
const Cart = require('./models/cartModel');
const CartItem = require('./models/cart-items');
const Order = require('./models/orderModel');
const OrderItem = require('./models/order-items');

const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/shop');
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    UserModel.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    })
});

// function ritik(req, res, next){
//     console.log('aaya');
//     next();
// }

app.use('/admin', adminRoutes);
app.use(homeRoutes);

app.use(errorController.get404);

ProductModel.belongsTo(UserModel, { constraints: true, onDelete: "CASCADE" });
UserModel.hasMany(ProductModel);
UserModel.hasOne(Cart);
Cart.belongsTo(UserModel);
Cart.belongsToMany(ProductModel, { through: CartItem });
ProductModel.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(UserModel);
UserModel.hasMany(Order);
Order.belongsToMany(ProductModel, { through: OrderItem });
ProductModel.belongsToMany(Order, { through: OrderItem });

sequelize
    .sync()
    // .sync({ force: true })
    .then(result => {
        return UserModel.findByPk(1);
    }).then(user => {
        if (!user) {
            return UserModel.create({
                fname: 'john',
                lname: 'doe',
                email: 'johndoe@mailinator.com',
                password: 'password',
                profileImg: 'https://www.author.thinkwithniche.com/profile.png',
            });
        }
        return user;
    }).then(user => {
        user.getCart().then(cart => {
            if (cart) {
                return cart;
            } else {
                return user.createCart();
            }
        })
        // console.log(user);
    })
    .then(cart => {
        if (app.listen(port)) {
            console.log(`Server started on http://localhost:${port}`);
        } else {
            console.log(`Somthing went wrong`);
        }
    })
    .catch(err => {
        console.log(err);
    });


