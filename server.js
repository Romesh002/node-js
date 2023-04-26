const express = require('express')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv')
dotenv.config();
const app = express();



// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server static files
// app.use(express.static('public'));
app.use(express.static('uploads'))

app.use('/user', userRoutes);

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function (req, res, next) {
  res.statusCode = 404;
  res.end();
});



// app.use(express.static(path.join(__dirname, 'public')));1

// Internal server error middleware
app.use(function (err, req, res, next) {
  res.statusCode = 500;
  res.end();
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, (p) => {
  console.log(`Server listening on port ${port}`);
});