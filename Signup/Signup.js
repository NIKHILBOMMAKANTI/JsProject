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

let submit = document.getElementById("submit");

/* Register user in Firebase, then redirect to login */
submit.addEventListener("click", (e) => {
  e.preventDefault();
  formvalidations();
  // registeruser();
});

/*Form Validations*/
function formvalidations() {
  let fname = document.getElementById("fname").value.trim();
  let lname = document.getElementById("lname").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmpassword = document.getElementById("confirmpassword").value.trim();
  let address = document.getElementById("address").value.trim();
  let city = document.getElementById("city").value.trim();
  let state = document.getElementById("state").value.trim();
  let zip = document.getElementById("zip").value.trim();
  let isValid = true;

  //Error Elements
  let FnameError = document.getElementById("fnameError");
  let LnameError = document.getElementById("lnameError");
  let EmailError = document.getElementById("emailError");
  let PasswordError = document.getElementById("pswdError");
  let ConfirmPasswordError = document.getElementById("confirmpswdError");
  let AddressError = document.getElementById("addressError");
  let CityError = document.getElementById("cityError");
  let StateError = document.getElementById("stateError");
  let ZipError = document.getElementById("zipError");

  // Clear all previous error messages
  FnameError.innerText = "";
  LnameError.innerText = "";
  EmailError.innerText = "";
  PasswordError.innerText = "";
  ConfirmPasswordError.innerText = "";
  AddressError.innerText = "";
  CityError.innerText = "";
  StateError.innerText = "";
  ZipError.innerText = "";

  //FirstName Validation
  if (fname == "") {
    FnameError.innerText = "First Name is required";
    isValid = false;
  } else if (fname.length < 4) {
    FnameError.innerText = "At least 4 characters required";
    isValid = false;
  } 

  //LastName Validation
  if (lname == "") {
    LnameError.innerText = "Last Name is required";
    isValid = false;
  } else if (lname.length < 4) {
    LnameError.innerText = "At least 4 characters required";
    isValid = false;
  } 

  //Email Validation

  const emailpattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/;
  if (email == "") {
    EmailError.innerText = "Email is required";
    isValid = false;
  } else if (!emailpattern.test(email)) {
    EmailError.innerText = "Please Enter a Valid Email";
    isValid = false;
  } 

  //Password Validation
  const passwordpattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (password == "") {
    PasswordError.innerText = "Password is required";
    isValid = false;
  } else if (!passwordpattern.test(password)) {
    PasswordError.innerText = "Please Enter a Valid Password";
    isValid = false;
  } 

  //Confirm Password Validation
  if (confirmpassword == "") {
    ConfirmPasswordError.innerText = "Confirm Password is required";
    isValid = false;
  } else if (password !== confirmpassword) {
    ConfirmPasswordError.innerText = "Passwords are not identical.";
    isValid = false;
  } 

  //Address Validation
  if (address == "") {
    AddressError.innerText = "Address is required";
    isValid = false;
  } else if (address.length < 4) {
    AddressError.innerText = "At least 4 characters required";
    isValid = false;
  } 

  //City Validation
  if (city == "") {
    CityError.innerText = "Address is required";
    isValid = false;
  } else if (city.length < 4) {
    CityError.innerText = "At least 4 characters required";
    isValid = false;
  } 

  //State Validation
  if (state == "") {
    StateError.innerText = "State is required";
    isValid = false;
  } else if (state.length < 4) {
    StateError.innerText = "At least 4 characters required";
    isValid = false;
  } 
  //Zip Validation
  if (zip == "") {
    ZipError.innerText = "zip is required";
    isValid = false;
  } else if (zip.length < 4) {
    ZipError.innerText = "At least 4 characters required";
    isValid = false;
  } 

  if (isValid) {
    registeruser();
  }
  console.log(isValid);
}

/*Registering userdetails*/
function registeruser() {
  let fname = document.getElementById("fname").value;
  let lname = document.getElementById("lname").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmpassword = document.getElementById("confirmpassword").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let state = document.getElementById("state").value;
  let zip = document.getElementById("zip").value;

  const userdetails = {
    Firstname: fname,
    Laststname: lname,
    Email: email,
    Password: password,
    ConfirmPassword: confirmpassword,
    Address: address,
    City: city,
    State: state,
    Zip: zip,
  };
  const userref = ref(
    database,
    `users/${userdetails.Firstname + " " + userdetails.Laststname}`
  );
  set(userref, userdetails);

  Swal.fire({
    title: "You're All Set!",
    text: "Thank you for registering. Your account is now active.",
    confirmButtonColor: "#006989",
    icon: "success",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "http://127.0.0.1:5503/Project/Login/Login.html";
    }
  });
}
