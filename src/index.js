const express = require("express");
const mongoose = require("mongoose")
const app = express();
const cors = require("cors"); 
const route = require("./routes/route.js")


const passport = require('passport');
const session = require('express-session')
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())


 app.use("/api", route)


mongoose
  .connect(
    "mongodb+srv://Satyaveer1994:Satyaveer123@cluster0.pn1nk.mongodb.net/satyaveer-Books",
    {
      useNewUrlParser: true,
    }
  )
  .then (() => console.log('mongoDB is connected '))
.catch(err => console.log(err))

app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running on port 3000`);
})
