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

let cartcontainer = document.getElementById("cart-container");
let buynowcontainer = document.getElementById("Buynowbtn");

async function retrieveAndDisplayCartData() {
  // let cart = [];
  cartcontainer.innerHTML = "";
  let sessionkey = JSON.parse(sessionStorage.getItem("Loggedinuser"));
  // console.log(sessionkey);

  let userref = ref(database, `/users/${sessionkey}/cart`);
  let cartdata = await get(userref).then((result) => result.val());

  for (let key in cartdata) {
    // console.log(cartdata[key].Brand);
    let card = document.createElement("div");
    card.className = "card product-card";
    card.setAttribute("product-id", cartdata[key].id);
    card.setAttribute("product-brand", cartdata[key].Brand);
    card.setAttribute("product-price", cartdata[key].Price)
    console.log(cartdata);
    cartcontainer.style.display = "grid";
    // cartcontainer.style.gridTemplateColumns = "repeat(3 , 1fr)";
    // cartcontainer.style.gap = "30px";
      card.innerHTML = `<div class="row g-0">
  <div class="col-md-4">
    <img src="${cartdata[key].Image}" class="img-fluid rounded-start" alt="${cartdata[key].Description}">
  </div>
  <div class="col-md-8">
    <div class="card-body">
      <h5 class="card-title">${cartdata[key].Description}</h5>
      <p><strong class="card-body-text">Brand:</strong>${cartdata[key].Brand}</p>
      <p class="price"><strong class="card-body-text">Price:</strong>${cartdata[key].Price}</p>
  <div class="quantity-controls">
    <strong class="card-body-text">Quantity:</strong>
    <button class="decrement" id="decrement">-</button>
    <span class="quantity" id="quantity">1</span>
    <button class="increment" id="increment">+</button>
  </div>

      <div class="card-body card-btn">
        <button class="btn btn-primary " id="buyProductBtn" type="button" >Buy Now</button>
        <button class="btn btn-primary removebtn" type="button" >Remove</button>
      </div>
    </div>
  </div>
  </div>
  `;

    //Buy Now Event Listner
    let buyProductBtn = card.querySelector("#buyProductBtn");

    buyProductBtn.addEventListener("click", () => {
      generateProductSummary(card);
    });

    //Increment quantity Event Listner
    let incrementbtn = card.querySelector("#increment");
    let quantity = card.querySelector("#quantity");
    incrementbtn.addEventListener("click", () => {
      increaseProductQuantity(quantity,card);
    });

    //Decreament quantity Event Listner
    let decrementbtn = card.querySelector("#decrement");
    decrementbtn.addEventListener("click", () => {
      decrementProductQuantity(quantity,card);
    });

    let img = card.querySelector("img");
    img.className = "product-img";

    cartcontainer.append(card);

    //Remove Functionality
    let removebtn = card.querySelectorAll(".removebtn");
    removebtn.forEach((cartbtn) => {
      cartbtn.addEventListener("click", () => {
        let productid = card.getAttribute("product-id");
        let productbrand = card.getAttribute("product-brand");
        removeCartItem(productid, productbrand, sessionkey);
      });
    });
  }

  if (cartdata && Object.keys(cartdata).length > 0) {
    buynowcontainer.innerHTML = `<button type="button" class="btn btn-primary btn-lg">Buy Now</button>`;
  }
}
retrieveAndDisplayCartData();
async function removeCartItem(productid, productbrand, sessionkey) {
  let userref = ref(database, `/users/${sessionkey}/cart/cart_${productid}`);
  let cart = await get(userref).then((result) => result.val());
  console.log(cart.Brand);
  console.log(cart.id);
  if (cart.id == productid && cart.Brand == productbrand) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006989",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "You have removed the item from your cart.",
          icon: "success",
          confirmButtonColor: "#006989",
        });
        remove(userref);
        retrieveAndDisplayCartData();
      }
    });
  }
}

/*Buy now Functionality*/
let buynow = document.getElementById("Buynowbtn");
buynow.addEventListener("click", generateOrderSummary);

async function generateOrderSummary() {
  let sessionkey = JSON.parse(sessionStorage.getItem("Loggedinuser"));
  let userref = ref(database, `/users/${sessionkey}`);
  let userdetails = await get(userref).then((result) => result.val());
  let Address =
    userdetails.Address +
    " " +
    userdetails.City +
    " " +
    userdetails.State +
    " " +
    userdetails.Zip;

    

  let total = 0;
  let orderedProducts = [];
  let orderDetails = "";
  let productcard = document.querySelectorAll(".product-card");
  console.log(productcard);
  productcard.forEach((Product) => {
    let producttitle = Product.querySelector(".card-title").innerText;
    let productimage = Product.querySelector("img").src;
    console.log(productimage);
    let quantity = Product.querySelector(".quantity").innerText;
    let unformattedprice = Product.querySelector(".price").innerText;
    let price = parseInt(unformattedprice.replace(/[^0-9]/g, ""));
    console.log(price);
    let productTotal =  price;
    total += productTotal;

    let Productobj ={
      ProductImage: productimage,
      ProductTitle: producttitle,
      ProductQuantity: quantity,
      productTotal: productTotal

    }
    orderedProducts.push(Productobj);

    orderDetails += `<tr class="">
        <td><img src=${productimage} class="cartimage"></img></td>
        <td>${producttitle.slice(0, 25)}...</td>
        <td>${quantity}</td>
        <td>₹${productTotal}</td>
        </tr>`;
  });
  Swal.fire({
    title: "Order Summary!",
    html: `<table style="width:100%; border-collapse: collapse; margin-bottom: 15px;">
        <hr>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        
        ${orderDetails}  <!-- Insert product rows here -->
      </table>
      <hr>
      <p><strong>Total:₹${total}</strong></p>`,
    icon: "info",
    confirmButtonColor: "#006989",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Order Placed!",
        text: "Your order will be delivered shortly",
        icon: "success",
        confirmButtonColor: "#006989",

        // let orderref = (database, `/users/${sessionkey}/myorders/order_${index}`)
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Order Delivered to",
            text: `${Address}`,
            icon: "success",
            confirmButtonColor: "#006989",
          });

        }
      });

      let unformatteddate = new Date();
      let date =  new Intl.DateTimeFormat('en-GB').format(unformatteddate);

      let timestamp = new Date().getTime();
      console.log(timestamp);
      
      let neworder = {
        Products: orderedProducts,
        orderedDate: date,
        Total: total,
        Address: Address
      }
      let orderref = ref(database, `/users/${sessionkey}/myorders/order_${timestamp}`);
      set(orderref , neworder);
    }
  });

  console.log(orderedProducts);
}

//Generate Order Summary For Each Product
async function generateProductSummary(Card) {
  console.log(Card);
  let sessionkey = JSON.parse(sessionStorage.getItem("Loggedinuser"));
  let userref = ref(database, `/users/${sessionkey}`);
  let userdetails = await get(userref).then((result) => result.val());
  let Address =
    userdetails.Address +
    " " +
    userdetails.City +
    " " +
    userdetails.State +
    " " +
    userdetails.Zip;

  let total = 0;
  let orderedProducts = [];
  let orderDetails = "";
  let ProductTitle = Card.querySelector(".card-title").innerText;
  let ProductImage = Card.querySelector(".product-img").src;
  let ProductQuantity = Card.querySelector(".quantity").innerText
  let unformattedprice = Card.getAttribute("product-price");
  let price = unformattedprice.replace(/[^0-9]/g,"");
  let productTotal = price * ProductQuantity;
   total += productTotal;

   let Productobj ={
    ProductImage: ProductImage,
    ProductTitle: ProductTitle,
    ProductQuantity: ProductQuantity,
    productTotal: total

  }
  orderedProducts.push(Productobj);
   
   orderDetails += `<tr>
   <td><img src=${ProductImage} class="cartimage"></img></td>
   <td>${ProductTitle.slice(0, 25)}...</td>
   <td>${ProductQuantity}</td>
   <td>₹${productTotal}</td>
   </tr>`;

   Swal.fire({
    title: "Order Summary!",
    html: `<table style="width:100%; border-collapse: collapse; margin-bottom: 15px;">
        <hr>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        
        ${orderDetails}  <!-- Insert product rows here -->
      </table>
      <hr>
      <p><strong>Total:₹${total}</strong></p>`,
    icon: "info",
    confirmButtonColor: "#006989",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Order Placed!",
        text: "Your order will be delivered shortly",
        icon: "success",
        confirmButtonColor: "#006989",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Order Delivered to",
            text: `${Address}`,
            icon: "success",
            confirmButtonColor: "#006989",
          });
        }
      });
      let unformatteddate = new Date();
      let date =  new Intl.DateTimeFormat('en-GB').format(unformatteddate);

      let timestamp = new Date().getTime();
      console.log(timestamp);
      
      let neworder = {
        Products: orderedProducts,
        orderedDate: date,
        Total: total,
        Address: Address
      }
      let orderref = ref(database, `/users/${sessionkey}/myorders/order_${timestamp}`);
      set(orderref , neworder);

    }
  });
}

//Fetch the Price based upon the Quantity
function updatePriceBasedOnQuantity(Card){
  let total = 0;
  let ProductQuantity = Card.querySelector(".quantity").innerText;

  let unformattedpriceElement = Card.querySelector(".price");
  let unformattedprice = unformattedpriceElement.innerHTML;

  let actualPrice = Card.getAttribute("product-price");
  let price = actualPrice.replace(/[^0-9]/g,"");
  let productTotal = price * ProductQuantity
  total += productTotal
  
  let updatedprice = unformattedprice.replace(/\d+(\.\d+)?/,total);
  unformattedpriceElement.innerHTML = updatedprice
 
}


//Increament ProductQuantity Functionality
function increaseProductQuantity(quantity , card) {
  let quantityvalue = parseInt(quantity.innerText);
  quantity.innerText = quantityvalue + 1;

  updatePriceBasedOnQuantity(card);
}

//Decreament ProductQuantity Functionality
function decrementProductQuantity(quantity , card) {
  let quantityvalue = parseInt(quantity.innerText);
  if (quantityvalue > 1) {
    quantity.innerText = quantityvalue - 1;
    updatePriceBasedOnQuantity(card);
  }
}
