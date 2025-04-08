const Products = require('./Productsdata.json');
const Cors = require('cors');
let Express = require('express');


let app = Express();

//Middleware
app.use(Cors());
let port = 3000
app.get("/Products",(req,res)=>{
    res.json(Products)
})
app.listen(port,(err)=>{
    if(err){
        console.log(JSON.stringify(err));
    }else{
        console.log("Server is Runing...");
    }
})