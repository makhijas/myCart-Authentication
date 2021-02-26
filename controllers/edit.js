const express = require('express');
const router = express.Router();

// import database
const db = require('../models');

router.get('/edit', (req, res) => {
  const { id, name, email } = req.user.get(); 
  console.log("********", req.user)
  db.food.findAll({where: {userId: id}})
  .then(foods => { 
    console.log(foods)
    if (foods.length === 0) {
      res.send("You have nothing in your fridge")
    } else { 
      res.render('edit', {name: name, id: id, email: email, foods: foods});
    }
  })
}); 

router.post('/edit', function(req, res) {
  console.log(req.body.item, req.body.quantity)
  // userId = req.params.id
  console.log(req.params.id)
  db.food.create({
    userId: req.params.id,
    item: req.body.item,
    quantity: req.body.quantity,
  })
  .then(function(post) {
    console.log(`${quantity} ${item} saved to database`)
    res.redirect('/profile')
  })
  .catch(function(error) {
    res.send(error)
  })
})

module.exports = router;
