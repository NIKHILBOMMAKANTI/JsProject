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

/*Validate username and password, then redirect to home on success. */
let submit = document.getElementById("login");
submit.addEventListener("click", (e) => {
  e.preventDefault();
  validateUser();
});
function validateUser() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("Password").value;

  let useremail = username.toLowerCase().trim();
  let paswd = password.toLowerCase().trim();
  let authenticated = false;
  console.log(username);
  console.log(password);
  let userref = ref(database, "users");
  get(userref).then((result) => {
    let data = result.val();

    for (const key in data) {
      data[key].Email = data[key].Email.toLowerCase().trim();
      data[key].Password = data[key].Password.toLowerCase().trim();
      console.log(data[key].Email);
      console.log(data[key].Password);

      if (data[key].Email == useremail && data[key].Password == paswd) {
        authenticated = true;
        sessionStorage.setItem("Loggedinuser", JSON.stringify(key));

        Swal.fire({
          title: "Login Successful",
          text: "You have successfully logged in to your account.",
          confirmButtonColor: "#000080",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href =
              "http://127.0.0.1:5503/Project/Homepage/Homepage.html";
          }
        });

        break;
      }
    }
    if (!authenticated) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "Invalid Username or Password",
        confirmButtonColor: "#000080",
      });
    }
  });
}
