const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const {sequelize}=require('./db')
const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');

const initialiseDb = require('./initialiseDb');
initialiseDb();
const port = 3000;
const app = express();
app.use(express.json())
app.use(express.urlencoded())

app.use(express.static('public'));

//app.use(express.json());
//000000000000000000000000000000000000000000000000000000000000000000
const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');
const seedDb = async () => {    
   // await sequelize.sync({ force: true });
    const restaurants = [
        {name : 'Chuys', image : '/img/chuys.gif',},
        {name : 'Ihope', image: '/img/ihope.gif'},
        {name : 'Wendys', image: '/img/wendys-eyebrows.gif'}
    ]
    const restaurantPromises = restaurants.map(restaurant => Restaurant.create(restaurant))
    await Promise.all(restaurantPromises)
    console.log("db populated!")
}
seedDb();
app.get('/',(req,res)=>{
    res.redirect('/restaurants')
})
//000000000000000000000000000000000000000000000000000000000000000
const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants',{restaurants});
});

app.get('/menus', async (req, res) => {
    const menus = await Menu.findAll();
    res.render('menus',{menus});
});
app.get('/menus/:id', async (req, res) => {
     const menu = await Menu.findByPk(req.params.id)
    //     {include: {
    //        model: Restaurant,
    //        include: MenuItem
    //    }})
    res.render('menu',{menu});
});

app.get('/menu/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.json(restaurant)
});
app.get('/restaurants/:id', async (req, res) => {
    const multrestaurants = await Restaurant.findAll();
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render('restaurant',{restaurant});
    // res.render('restaurant',{multrestaurants});
});

app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});

// app.delete('/restaurants/:id', async (req, res) => {
//     await Restaurant.destroy({
//         where: {
//             id: req.params.id
//         }
//     });
//     res.sendStatus(200);
// });

// app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const restaurant = await Restaurant.findByPk(req.params.id);
//     await restaurant.update(req.body);
//     res.sendStatus(200);
// });
app.get('/restaurant-data', async (req,res) => {
    const restaurants = await Restaurant.findAll();
    res.json({restaurants})
})
app.get('/new-restaurant',  (req,res)=>{
    
    res.render('newrestaurant')
})
app.post('/new-restaurant', async (req,res)=>{
    let restaurantAlert=""
    const newRestaurant=await Restaurant.create(req.body)
    console.log(newRestaurant)    
    restaurantAlert = `Restaurant ${newRestaurant.name} has been added`
  const foundRestaurant = await Restaurant.findByPk(newRestaurant.id)
  if (foundRestaurant){
      res.render('newrestaurant',{restaurantAlert})
        } else {
            restaurantAlert ='Failed to add Sauce'
            res.render('newrestaurant',{restaurantAlert})
        }
   // res.status(201).send(`New Sauce ${newSauce.name} has been added`)
})


app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});
app.delete('/restaurants/:id', async (req,res)=>{
    const deletedRestaurant = await Restaurant.destroy({
        where: {id:req.params.id}
    })
    const restaurants = await Restaurant.findAll();
    res.render('restaurants', {restaurants})
})
app.put('/restaurants/:id', async (req,res) => {
    let updatedRestaurant = await Restaurant.update(req.body, {
        where: {id: req.params.id}
    })
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('restaurant', {restaurant})
})

app.put('/restaurants/:id',async()=>{
    let res = await fetch(`/restaurants/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            likes:1
        })
    })
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});