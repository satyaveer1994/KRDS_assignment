const express = require('express');
const router = express.Router();

const passport = require('passport');
const { fetchBooks, addBooks } = require("../Controllers/BookControllers")
const { login, addToList, fetchUser,removeBookFromList ,deleteList} = require("../Controllers/UserController")


/* ================= GOOGLE AUTHENTICATIONS =========================== */
router.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));

router.get("/auth/callback", passport.authenticate( 'google', {
    successRedirect: '/api/auth/callback/success',
    failureRedirect: 'api/auth/callback/failure'
}))
router.get('/auth/callback/success' ,login );
router.get('/api/auth/callback/failure', (req,res) =>{
    res.status(500).send({error:"log in error ,please try again"})
})
// MIddleware for authorization ===
const AuthMiddleware = (req, res,next) =>{

   try{ console.log(req.isAuthenticated())
    if(req.isAuthenticated()) { return next() }
    else res.redirect('/api')
}catch(err){
    res.status(500).json({message:err.message})
}
}
/*======================================================================== */
// router.get("/protected", AuthMiddleware ,(req,res)=>{
//     res.send("PROTECTED")
// })
router.post('/book',addBooks)


router.get('/books',fetchBooks);

router.post('/list/:id',addToList);
router.put('/list/:id',removeBookFromList)
router.delete('/list/:id',deleteList)

router.post('/user',fetchUser)



module.exports = router