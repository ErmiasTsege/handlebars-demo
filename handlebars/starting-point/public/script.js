//find element with the id details-btn
let btn = document.getElementById('details-btn')
//find the element with the id menu-bt
let menuBtn = document.getElementById('menu-btn')
 let deleteBtn = document.getElementById('delete-btn')
//find element with the id list
let list = document.getElementById('list')
let menuList = document.getElementById('menu')
list.style.display='none'
menuList.style.display='none'
let oneRestaurant = document.getElementById('oneRestaurant')
menuBtn.addEventListener('click', async () => {
const id= window.location.pathname.split('/restaurants/')
console.log(id)
    menuList.style.display='block'
    //fetch the menu route from express
   // let res = await fetch(`/menu/${id}`)
   let res = await fetch('/menu/1')
    console.log(res)
    //parse as json
    let restaurant = await res.json()
    //access Menus in respone
    let menus = restaurant.Menus
    console.log(menus)
    //for each menu in the list, create a sublist
    menuList.innerText = ""
    for(m of menus){
        //add a size 3 header for each menu
        let menuLabel = document.createElement('h3')
        menuLabel.innerText = m.title
        menuList.append(menuLabel)
        let menu = document.createElement('ul')
        //for each menu item in that menu, create a list item
        for(i of m.MenuItems){
            let item = document.createElement('li')
            item.innerText = `${i.name}: ${i.price}`
            menu.append(item)
        }
        menuList.append(menu)
    }

})


//add event listener when this button is clicked
btn.addEventListener('click', async () => {
    list.style.display='block'
   
    //fetch the restaurant-data path from my express server
    let res = await fetch('/restaurant-data');
    //parse the response as json - just the data
    let restaurantList = await res.json();
    //console.log the data from the response
    list.innerText = ""
    let allRestaurantContainer=document.createElement('h3')
    allRestaurantContainer.innerText="All Restaurants:"
    list.append(allRestaurantContainer)
    for(item of restaurantList.restaurants){
        let restaurantLabel = document.createElement('h5')
        restaurantLabel.innerText = item.name
        list.append(restaurantLabel)
    }
  });

  deleteBtn.addEventListener('click',()=>{
  
    oneRestaurant.remove()
   list.remove()
   menuList.remove()
  })