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

/*Displaying the Loggedin user from Session */
function displayLoggedInUser() {
  let Loggedinuser = JSON.parse(sessionStorage.getItem("Loggedinuser"));

  console.log(Loggedinuser);
  let span = document.getElementById("loggeinuser");
  span.innerText = "Welcome," + " " + Loggedinuser;
}
displayLoggedInUser();


let productData = [];
let productcontainer = document.getElementById("product-container");
async function getDataFromAPI() {
  let index = 1;
  const url = "http://localhost:3000/Products";
  const options = {
    method: "GET",
    // headers: {
    //   "x-rapidapi-key": "90b6fcc8femshd2825e132f1b219p1dde7djsne0b2ea21bd03",
    //   "x-rapidapi-host": "ecommerce-api3.p.rapidapi.com",
    // },
  };
  let response = await fetch(url, options);
  let data = await response.json();
  data.forEach((Product) => {
    let ratingvalue = (Math.random() * 4 + 1).toFixed(1);
    let reviewvalue = (Math.random() * 1000).toFixed(0);

    let productItem = {
      id: index,
      ...Product,
      rating: ratingvalue,
      review: reviewvalue,
    };
    productData.push(productItem);

    index++;
  });
  console.log(productData);

  displayProductById();
}
getDataFromAPI();

function displayProductById() {
  let currentpageurl = window.location.search;
  console.log(currentpageurl);
  let urlparams = new URLSearchParams(currentpageurl);
  let id = urlparams.get("id");
  let unformattedcategory = urlparams.get("productbrand");
  console.log(unformattedcategory);
  let brand = unformattedcategory.replace(/-/g, " ");
  productData.filter((Product) => {
    if (Product.id == id && Product.Brand == brand) {
      let productcard = document.createElement("div");
      productcard.innerHTML = `<div class="container">
  <div class="row">
    <div class="col-md-6">
      <img src="${Product.Image}" alt="Product Image" class="img-fluid">
    </div>
    <div class="col-md-6">
      <h3>${Product.Description}</h3>
      <p><strong class="brand-info_heading">Brand:</strong>${Product.Brand}</p>
      <p><strong class="brand-info_heading">Price:</strong>${Product.Price}</p>
      <p><strong class="brand-info_heading">Rating:</strong>${Product.rating}</p>
      <p><strong class="brand-info_heading">Review:</strong>${Product.review}</p>
       <div class="card-body">
       <button class="btn btn-primary addtocartbtn" type="button" id="addtocart">Add to Cart</button>
       <button class="btn btn-primary product-btn" type="button" id="product-btn">Buy Now</button>
    </div>
    </div>
  </div>
</div>`;

    //BuyNow Event Listner
    console.log(productcard);
    let productbtn = productcard.querySelector("#product-btn")
    productbtn.addEventListener("click", redirectToCart);
    
    let Addtocartbtn = productcard.querySelector("button");
    Addtocartbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      addToCart(Product);
    });

      let img = productcard.querySelector("img");
      img.setAttribute("height", "300px");

      productcontainer.append(productcard);
    }
  });

  getMatchingProducts(id, brand);
}

//Fetching Matching Products
let matchingproducts = document.getElementById("matching-products");
let filteredData = [];
function getMatchingProducts(productid, productbrand) {
  let heading = document.getElementById("heading");
  heading.innerText = "You Might Also Like";

  productData.filter((Products) => {
    if (Products.id != productid && Products.Brand == productbrand) {
      filteredData[filteredData.length] = Products;
    }
  });
  let productPageData = filteredData.slice(0, 4);
  console.log(filteredData);
  console.log(productPageData);
  matchingproducts.style.display = "grid";
  productPageData.forEach((Products) => {
    let productcard = document.createElement("div");
    productcard.setAttribute("class", "card");
    productcard.innerHTML = `<div class="wishlist-container"><i class="fa-regular fa-heart fa-heart-inactive"></i></div>
    <img src=${Products.Image} class="card-img-top product-img" alt="${Products.Description}">
    <div class="card-body">
      <h5 class="card-title">${Products.Description}</h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Brand:</strong>${Products.Brand}</li>
      <li class="list-group-item"><strong>Price:</strong>${Products.Price}</li>
      <li class="list-group-item review-rating-container">
      <div class="rating">${Products.rating}
      <span><i class="fa-solid fa-star"></i></span></div>
      <span class="reviews">${Products.review} Reviews</span>
      </li>
    </ul>
    <div class="card-body">
       <button class="btn btn-primary " type="button" id="addtocart">Add to Cart</button>
    </div>`;
    

    // AddtoCart Event Listner
    let Addtocartbtn = productcard.querySelector("button");
    Addtocartbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      addToCart(Products);
    });

    //Wishlist Event Listner
    let wishlist = productcard.querySelector(".fa-heart");
    wishlist.addEventListener("click", (e) => {
      wishlist.classList.add("fa-heart-active");
      wishlist.classList.remove("fa-heart-inactive");
      e.stopPropagation();
      e.preventDefault();
      addtowishlist(Products);
    });
    let img = productcard.querySelector("img");
    img.setAttribute("width", "225px");
    img.setAttribute("height", "232px");

    matchingproducts.append(productcard);
  });
}


/*AddtoWishlist Functionality */
function addtowishlist(Products) {
  Swal.fire({
    title: "Added to Wishlist!",
    text: "Product has been added to your wishlist.",
    confirmButtonColor: "#006989",
    icon: "success",
  }).then((result) => {
    if (result.isConfirmed) {
      let loggedinuser = JSON.parse(sessionStorage.getItem("Loggedinuser"));
      let wishlistref = ref(
        database,
        `users/${loggedinuser}/wishlist/wishlist_${Products.id}`
      );
      set(wishlistref, Products);
    }
  });
  console.log(Products);
}

/*Add to Cart Functionality*/
function addToCart(Productitem) {
  Swal.fire({
    title: "Add this item to your cart?",
    text: `Are you sure you want to add this item to Cart.`,
    confirmButtonColor: "#006989",
    imageUrl: `${Productitem.Image}`,
    imageWidth: 225,
    imageHeight: 232,
    imageAlt: "Custom image",
  }).then((result) => {
    if (result.isConfirmed) {
      let timerInterval;
      Swal.fire({
        title: "Product Added to Cart!",
        html: "This item has been successfully added to your cart",
        confirmButtonColor: "#006989",
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
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
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

//Redirect To Cart
function redirectToCart(){
  window.location.href = "http://127.0.0.1:5503/Project/Cart/Cart.html";
}