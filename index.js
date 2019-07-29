// Required System Module Files
const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;

// Required Module Files
var {mongoose} = require('./db/mongoose');


const app = express()
const hbs = require('hbs')
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));


// registerPartials for Admin
hbs.registerPartials(__dirname+'/views/partials/')
// registerPartials for User
//hbs.registerPartials(__dirname+'/views/user/partials/')

// To print Json object in HBS file using {{json this}}
hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

// Set View Engine
app.set('view engine', 'hbs')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Public Content (css, js, images)
app.use(express.static(__dirname+'/public'))

// Route to /routes/index.js
app.use(require('./routes'))


// Start server
app.listen(port, () => {
    console.log(`Server Started at port ${port}`)
})
