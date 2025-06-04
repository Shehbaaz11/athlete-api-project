const mongoose = require ('mongoose');

mongoose.connect("mongodb://localhost:27017/arthleteDB").then(()=>{
    console.log("connect to mongodb successfully")
})
.catch((err)=>{
    console.log("mongo not connected"+err);
})

