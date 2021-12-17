//find element with the id details-btn
let btn = document.getElementById('details-btn')
//find the element with the id menu-bt
const likeCounter = document.querySelector('#like-counter')
const disLikeCounter = document.querySelector('#dislike-counter')
let menuBtn = document.getElementById('menu-btn')
 let deleteBtn = document.querySelector('#delete-btn')
 let likeBtn=document.getElementById('like-btn')
 let disLikeBtn=document.getElementById('dislike-btn')
//find element with the id list
let list = document.getElementById('list')
let menuList = document.getElementById('menu')
list.style.display='none'
menuList.style.display='none'
let oneRestaurant = document.getElementById('oneRestaurant')
menuBtn.addEventListener('click', async () => {
    menuList.style.display='block'
let id = window.location.pathname.split('/restaurants/')[1]
console.log(id)
    
    //fetch the menu route from express
    let res = await fetch(`/menu/${id}`)
   //let res = await fetch('/menu/5')
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

//find the delete-button in the document

//add event to delete this sauce
deleteBtn.addEventListener('click', async () => {
    //get id from the current url path
   const id = window.location.pathname.split('/restaurants/')[1]
    //fetch the menu route from express for this id
    let res = await fetch(`/restaurants/${id}`, {
        method: 'DELETE',
    })
    console.log(res)
    window.location.assign('/restaurants')
})

likeBtn.addEventListener('click',async()=>{
    let id = window.location.pathname.split('/restaurants/')[1]
    let currentLikes=parseInt(likeCounter.innerHTML)
    console.log(currentLikes ,id)
    currentLikes+=1
    likeCounter.innerHTML=currentLikes
    let res=await fetch(`/restaurants/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',

        },
        body:JSON.stringify({
            likes:currentLikes
        })
    })
})
disLikeBtn.addEventListener('click',async()=>{
    let id = window.location.pathname.split('/restaurants/')[1]
    let currentDisLikes=parseInt(disLikeCounter.innerHTML)
    console.log(currentDisLikes ,id)
    currentDisLikes-=1
    disLikeCounter.innerHTML=currentDisLikes
    let res=await fetch(`/restaurants/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',

        },
        body:JSON.stringify({
            dislikes:currentDisLikes
        })
    })
})
    

//onclick function to delete a sauce by id
async function deleteRestaurant(id){
    //delete a sauce matching parameter id
    let res = await fetch(`/restaurants/${id}` ,{
        method: 'DELETE'
    })
    console.log(res)
    //send user back to the sauces path
    window.location.assign('/restaurants')
}