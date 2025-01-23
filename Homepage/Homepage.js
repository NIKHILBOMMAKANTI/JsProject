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

  if (Loggedinuser) {  
  span.innerText = "Welcome," + " " + Loggedinuser;
  }else{
  span.innerText = "Welcome, User";
  }

}
displayLoggedInUser();

//Fetch data from API, append new data, and store in result array.
let productData = [];
async function getDataFromAPI() {
  let index = 1;
  const url = "https://ecommerce-api3.p.rapidapi.com/menswear";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "90b6fcc8femshd2825e132f1b219p1dde7djsne0b2ea21bd03",
      "x-rapidapi-host": "ecommerce-api3.p.rapidapi.com",
    },
  };
  let response = await fetch(url, options);
  let data = await response.json();
  data.forEach((Product) => {
    let ratingvalue = (Math.random() * 4 + 1).toFixed(1);
    let reviewvalue = (Math.random() * 1200).toFixed(0);

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

  fetchDefaultProducts();
}
getDataFromAPI();

//Fetching the default Products
let productcontainer = document.getElementById("product-container");
function fetchDefaultProducts() {
  let defaultproducts = productData.slice(0, 12);
  console.log(defaultproducts);
  productcontainer.style.display = "grid";
  // productcontainer.style.gridTemplateColumns = "repeat(4 , 1fr)";
  productcontainer.className = "justify-content-center product-container pl-lg-0";
  // productcontainer.style.paddingLeft = "15px";
  productcontainer.style.gap = "30px";
  defaultproducts.forEach((Products) => {
    let productcard = document.createElement("div");
    productcard.setAttribute("Product-id", Products.id);
    productcard.setAttribute("Product-brand", Products.Brand);
    productcard.setAttribute("class", "card col-12");
    productcard.style.width = "18rem";

    productcard.innerHTML = `<div class="wishlist-container"><i class="fa-regular fa-heart fa-heart-inactive"></i></div>
    <img src=${Products.Image} class="card-img-top" alt="${Products.Description}">
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
       <button class="btn btn-primary" type="button" id="addtocart">Add to Cart</button>
    </div>`;

    let img = productcard.querySelector("img");
    img.setAttribute("width", "225px");
    img.setAttribute("height", "232px");

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

    //Append the Product-id and Product-Brand to the Url
    productcard.addEventListener("click", () => {
      let productid = productcard.getAttribute("Product-id");
      let productbrand = productcard.getAttribute("Product-brand");
      let formattedcategory = productbrand.replace(/\s+/g, "-");

      window.location.href =
        "http://127.0.0.1:5503/Project/Productdetailspage/productdetailspage.html?id=" +
        productid +
        "&productbrand=" +
        formattedcategory;
    });

    productcontainer.append(productcard);
  });
}

/*Pagination Functionality*/
let currentpage = 1;
let itemsperpage = 12;
let searchResults = [];
let Next = document.getElementById("Next");
let Previous = document.getElementById("Previous");
Next.addEventListener("click", () => {
  currentpage++;
  updatePagination(searchResults);
});
Previous.addEventListener("click", () => {
  if (currentpage > 1) {
    currentpage--;
    decrementPagination();
    fetchItemsPerPage(searchResults);
  }
});

function updatePagination() {
  let activepageElement = document.getElementById("active-page");
  let activepagecount = activepageElement.innerText;
  activepagecount++;
  activepageElement.innerText = activepagecount;

  let secoundpageElement = document.getElementById("page-2");
  let secoundpagecount = secoundpageElement.innerText;
  secoundpagecount++;
  secoundpageElement.innerText = secoundpagecount;

  let thirdpageElement = document.getElementById("page-3");
  let thirdpagecount = thirdpageElement.innerText;
  thirdpagecount++;
  thirdpageElement.innerText = thirdpagecount;

  fetchItemsPerPage(searchResults);
}

function decrementPagination() {
  let activepageElement = document.getElementById("active-page");
  let activepage = activepageElement.innerText;
  activepage--;
  activepageElement.innerText = activepage;

  let secoundpageElement = document.getElementById("page-2");
  let secoundpage = secoundpageElement.innerText;
  secoundpage--;
  secoundpageElement.innerText = secoundpage--;

  let thirdpageElement = document.getElementById("page-3");
  let thirdpage = thirdpageElement.innerText;
  thirdpage--;
  thirdpageElement.innerText = thirdpage;
}

/*Get Paginated items */
function fetchItemsPerPage(category = null) {
  productcontainer.innerHTML = "";
  let start = (currentpage - 1) * itemsperpage;
  let end = start + itemsperpage;

  console.log(productData);
  console.log(category);
  // let filteredData = category ? category : productData;
  let filteredData =
    Array.isArray(category) && category.length > 0 ? category : productData;

  console.log(filteredData);

  let currentPagePoducts = filteredData.slice(start, end);
  console.log(currentPagePoducts);
  currentPagePoducts.forEach((Products) => {
    let productcard = document.createElement("div");
    productcard.setAttribute("Product-id", Products.id);
    productcard.setAttribute("Product-brand", Products.Brand);
    productcard.setAttribute("class", "card");
    productcard.style.width = "18rem";

    productcard.innerHTML = `<div class="wishlist-container"><i class="fa-regular fa-heart fa-heart-inactive"></i></div>
    <img src=${Products.Image} class="card-img-top" alt="${Products.Description}">
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
     <button class="btn btn-primary" type="button">Add to Cart</button>
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

    //Append the Product-id and Product-Brand to the Url
    productcard.addEventListener("click", () => {
      let productid = productcard.getAttribute("Product-id");
      let productbrand = productcard.getAttribute("Product-brand");
      let formattedcategory = productbrand.replace(/\s+/g, "-");

      window.location.href =
        "http://127.0.0.1:5503/Project/Productdetailspage/productdetailspage.html?id=" +
        productid +
        "&productbrand=" +
        formattedcategory;
    });

    let img = productcard.querySelector("img");
    img.setAttribute("width", "225px");
    img.setAttribute("height", "232px");

    productcontainer.append(productcard);
  });
}

/*Toggle Functionality */
let filter = document.getElementById("filter");
let content = document.getElementById("content");

filter.addEventListener("click", displayCategories);
function displayCategories() {
  content.classList.toggle("hidden");
  content.classList.toggle("visible");
}

let pricefilter = document.getElementById("pricefilter");
let pricecontent = document.getElementById("pricecontent");

pricefilter.addEventListener("click", displayPrice);
function displayPrice() {
  pricecontent.classList.toggle("hidden");
  pricecontent.classList.toggle("visible");
}

let ratingfilter = document.getElementById("ratingfilter");
let ratingcontent = document.getElementById("ratingcontent");

ratingfilter.addEventListener("click", displayrating);
function displayrating() {
  ratingcontent.classList.toggle("hidden");
  ratingcontent.classList.toggle("visible");
}

let reviewfilter = document.getElementById("reviewfilter");
let reviewcontent = document.getElementById("reviewcontent");
reviewfilter.addEventListener("click", displayreview);
function displayreview() {
  reviewcontent.classList.toggle("hidden");
  reviewcontent.classList.toggle("visible");
}

/*Search Functionality*/
let Searchbtn = document.getElementById("search-btn");

Searchbtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchProducts();
});
function searchProducts() {
  console.log("SearchProducts function is being called...");
  searchResults = [];
  let Searchinput = document.getElementById("search-input");
  let inputvalue = Searchinput.value;
  console.log(inputvalue);

  productData.filter((Product) => {
    let priceValue = Product.Price.replace("₹", "");
    console.log(priceValue);
    if (Product.Brand == inputvalue) {
      searchResults[searchResults.length] = Product;
    } else if (Product.rating == inputvalue) {
      searchResults[searchResults.length] = Product;
    } else if (Product.Description == inputvalue) {
      searchResults[searchResults.length] = Product;
    } else if (priceValue == inputvalue) {
      searchResults[searchResults.length] = Product;
    }
  });
  console.log(searchResults);
  fetchItemsPerPage(searchResults);
}

/*Filter Functionality*/
window.filterProducts = filterProducts;
function filterProducts() {

  //Resetting the SearchResults
  searchResults = [];

  const checkboxes = document.querySelectorAll(".filter-category input[type='checkbox']")
  console.log(checkboxes);

  let selectedFilters = [];
  checkboxes.forEach((checkbox)=>{
    if(checkbox.checked){
        const filtervalue = checkbox.value;
        selectedFilters[selectedFilters.length] = filtervalue;
    }
  })
  
  selectedFilters.forEach((filtervalue)=>{
    productData.filter((Product) => {
      if (Product.Brand == filtervalue) {
        searchResults[searchResults.length] = Product;
      } else if (Product.rating >= filtervalue )  {
        searchResults[searchResults.length] = Product;
      }
    });
  });

  console.log(selectedFilters);
  console.log(searchResults);
  fetchItemsPerPage(searchResults);
}

window.filterbasedonprice = filterbasedonprice;
function filterbasedonprice(filtervalue) {
  searchResults = [];
  filtervalue = parseInt(filtervalue);
  console.log(filtervalue)
  console.log(typeof filtervalue);
  searchResults = productData.filter((Product) => {
    let pricevalue = parseInt(Product.Price.replace(/[₹,]/g, ""));
    console.log(pricevalue);
    console.log(typeof pricevalue);
    return pricevalue >= filtervalue;
  });
  console.log("searchResults:", searchResults);
  fetchItemsPerPage(searchResults);
}

window.filterbasedonreview = filterbasedonreview;
function filterbasedonreview(filtervalue) {
  searchResults = [];
  filtervalue = parseInt(filtervalue);
  productData.filter((Product) => {
    let review = parseInt(Product.review);
    if (review >= filtervalue) {
      searchResults[searchResults.length] = Product;
    }
  });
  console.log("searchResults:", searchResults);
  fetchItemsPerPage(searchResults);
}
/*Add to Cart Functionality*/
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
          window.location.href = "http://127.0.0.1:5503/Project/Cart/Cart.html";

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

/*Addtowishlist */
function addtowishlist(Products) {
  Swal.fire({
    title: "Added to Wishlist!",
    text: "Product has been added to your wishlist.",
    confirmButtonColor: "#000080",
    icon: "success",
  }).then((result) => {
    if (result.isConfirmed) {
      let loggedinuser = JSON.parse(sessionStorage.getItem("Loggedinuser"));
      let wishlistref = ref(
        database,
        `users/${loggedinuser}/wishlist/wishlist_${Products.id}`
      );
      set(wishlistref, Products).then(()=>{
        window.location.href = "http://127.0.0.1:5503/Project/Wishlist/Wishlist.html";

      });

    }
  });
  console.log(Products);

}
