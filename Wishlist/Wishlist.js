/*Resetting the preflight styles of Tailwindcss*/


// Importing the packages from cdn which are required for firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPf1-c6gZR-l1UJAvEKVuoq2WG5isBwkk",
  authDomain: "ecommerce-website-b1bfe.firebaseapp.com",
  projectId: "ecommerce-website-b1bfe",
  storageBucket: "ecommerce-website-b1bfe.firebasestorage.app",
  messagingSenderId: "895855985382",
  appId: "1:895855985382:web:88942641ed99f3c37c3127",
  measurementId: "G-9724EE4P0M",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// /*Displaying the Loggedin user from Session */
function displayLoggedInUser() {
    let Loggedinuser = JSON.parse(sessionStorage.getItem("Loggedinuser"));
  
    console.log(Loggedinuser);
    let span = document.getElementById("loggeinuser");
    span.innerText = "Welcome," + " " + Loggedinuser;
  }
  displayLoggedInUser();

  let wishlistcontainer = document.getElementById("wishlist-container");

  async function retrieveAndDisplayWishlistData(){
    wishlistcontainer.innerHTML = "";
    let sessionkey = JSON.parse(sessionStorage.getItem("Loggedinuser"));

    let userref = ref(database, `/users/${sessionkey}/wishlist`);
    let wishlistdata = await get(userref).then((result) => result.val());
    console.log(wishlistdata);

    
  for (let key in wishlistdata) {
    // console.log(cartdata[key].Brand);
    let card = document.createElement("div");
    card.className = "card product-card";
    card.setAttribute("product-id", wishlistdata[key].id);
    card.setAttribute("product-brand", wishlistdata[key].Brand);
    console.log(wishlistdata);
    wishlistcontainer.style.display = "grid";
    // wishlistcontainer.style.gridTemplateColumns = "repeat(3 , 1fr)";
    wishlistcontainer.style.gap = "30px";
    card.innerHTML = `<div class="row g-0">
<div class="col-md-4">
  <img src="${wishlistdata[key].Image}" class="img-fluid rounded-start" alt="${wishlistdata[key].Description}">
</div>
<div class="col-md-8">
  <div class="card-body">
    <h5 class="card-title">${wishlistdata[key].Description}</h5>
     <p><strong class="card-body-text">Brand:</strong>${wishlistdata[key].Brand}</p>
     <p class="price"><strong class="card-body-text">Price:</strong>${wishlistdata[key].Price}</p>
     <div class="card-body card-btn">
        <button class="btn btn-primary removebtn" type="button" >Remove</button>
        <button class="btn btn-primary addtocartbtn animate__flash" type="button" >Add To Cart</button>
    </div>
    
  </div>
</div>
</div>
`;

let img = card.querySelector("img");
    img.className = "product-img";

    wishlistcontainer.append(card);

    //AddtoCart Event Listner
    let addtocartbtn = card.querySelectorAll(".addtocartbtn");
    addtocartbtn.forEach((wishlistbtn)=>{
        wishlistbtn.addEventListener("click" ,()=>{
            let productData = wishlistdata[key];
            addToCart(productData);
            console.log(productData);
        });
    })

    //Remove Event Listner
    let removebtn = card.querySelectorAll(".removebtn");
    removebtn.forEach((cartbtn) => {
      cartbtn.addEventListener("click", () => {
        let productid = card.getAttribute("product-id");
        let productbrand = card.getAttribute("product-brand");
        removeWishListItem(productid, productbrand, sessionkey);
      });
    });
  }


  

  

 } retrieveAndDisplayWishlistData();

 //AddtoCart Functionality
 function addToCart(Productitem) {
   Swal.fire({
     title: "Add this item to your cart?",
     text: `Are you sure you want to add this item to Cart.`,
     imageUrl: `${Productitem.Image}`,
     imageWidth: 225,
     imageHeight: 232,
     imageAlt: "Custom image",
     confirmButtonColor: "#000080",

   }).then((result) => {
     if (result.isConfirmed) {
       let timerInterval;
       Swal.fire({
         title: "Product Added to Cart!",
         html: "This item has been successfully added to your cart",
         timer: 2000,
         timerProgressBar: true,
         didOpen: () => {
           Swal.showLoading();
           const timer = Swal.getPopup().querySelector("b");
           timerInterval = setInterval(() => {
             timer.textContent = `${Swal.getTimerLeft()}`;
           }, 100);
         },
         willClose: () => {
           clearInterval(timerInterval);
         },
       }).then((result) => {
         /* Read more about handling dismissals below */
         if (result.dismiss === Swal.DismissReason.timer) {
           console.log("I was closed by the timer");
          //  window.location.href = "http://127.0.0.1:5503/Project/Cart/Cart.html";

         }
       });
     }
   });
   let loggedinuser = JSON.parse(sessionStorage.getItem("Loggedinuser"));
   let addtocardref = ref(
     database,
     `users/${loggedinuser}/cart/cart_${Productitem.id}`
   );
   set(addtocardref, Productitem);
 }

 //Remove Wishlist Item
 async function removeWishListItem(productid, productbrand, sessionkey){

  let userref = ref(database, `/users/${sessionkey}/wishlist/wishlist_${productid}`);
    let cart = await get(userref).then((result) => result.val());
    console.log(cart.Brand);
    console.log(cart.id);
    if (cart.id == productid && cart.Brand == productbrand) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "You have removed the item from your Wishlist.",
            icon: "success",
            confirmButtonColor: "#000080",
          });
          remove(userref);
          retrieveAndDisplayWishlistData();
        }
      });
    }
 } 
