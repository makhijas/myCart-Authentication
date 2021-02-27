
require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override')
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');
const db = require ('./models')


const app = express();
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');

// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// Session Middleware

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));
// Passport
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session
// Flash 
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'));
//app.use('/edit', require('./controllers/edit'));

app.get('/', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  // const {item, quantity} = req.food.get()
  res.render('index', { name: name, id: id, email: email });
});


app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  // const { item } = req.food.get()
  db.food.findAll({where: {userId: id}})
  .then(foods => { 
    //console.log(foods)
    //res.render('profile')
    if (foods.length === 0) {
      req.flash('error', "It's time for a trip to the grocery store...There's nothing in your fridge right now!");
      // res.send("You have nothing in your fridge")
      res.render('profile', {name: name, id: id, email: email, foods: foods});
    } else { 
      res.render('profile', {name: name, id: id, email: email, foods: foods});
    }
  })
}); 


app.get('/edit', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  //console.log("********", req.user)
  db.food.findAll({where: {userId: id}})
  .then(foods => { 
    //console.log(foods)
    if (foods.length === 0) {
      req.flash('error', "It's time for a trip to the grocery store...There's nothing in your fridge right now!");
      // res.send("You have nothing in your fridge")
      res.render('edit', {name: name, id: id, email: email, foods: foods});
    } else { 
      res.render('edit', {name: name, id: id, email: email, foods: foods});
    }
  })
}); 


app.post('/edit', function(req, res) {
  //console.log(req.body.item, req.body.quantity)
  // userId = req.params.id
  //console.log(req.params.id)
  db.food.create({
    userId: req.params.id,
    item: req.body.item,
    quantity: req.body.quantity,
  })
  .then(function(post) {
    //console.log(`${quantity} ${item} saved to database`)
    res.redirect('/edit')
  })
  .catch(function(error) {
    res.send(error)
  })
})


app.post('/profile', (req, res) => {
  let item = req.body.item
  let quantity = req.body.quantity
  
  db.item = item
  db.quantity = quantity
  //console.log(`I have ${quantity} ${item}`)
  db.food.create({
    //where: {id: req.params.id},
    userId: req.body.userId,
    item: req.body.item,
    quantity: req.body.quantity,
  })
  .then(function(post) {
    //console.log(`${quantity} ${item} saved to database`)
    res.redirect('/profile')
  })
  .catch(function(error) {
    res.send(error)
  })
});


app.delete('/edit/:id', (req, res) =>{
  console.log("******************************")
  console.log(req.params.id)
  let id = req.params.id
  db.food.findOne({
    where: {
      id: id
    }
  })
  .then(function(item) {
    item.destroy()}).then(() => {
      res.redirect('/profile')
    })
    .catch(function(error) {
      res.send(error)
    })
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;

