const express = require('express');
const router = express.Router();

const passport = require('passport');
const bookController = require("../Controllers/BookControllers")
const userController= require("../Controllers/UserController")



/* ================= GOOGLE AUTHENTICATIONS =========================== */
router.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));

router.get("/auth/callback", passport.authenticate( 'google', {
    successRedirect: '/api/auth/callback/success',
    failureRedirect: 'api/auth/callback/failure'
}))
router.get('/auth/callback/success',userController.login );
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
router.post('/book',bookController.createBook)


router.get('/books',bookController.getBook);

router.post('/list/:id',userController.addToList);
router.put('/list/:id',userController.removeBookFromList)
router.delete('/list/:id',userController.deleteList)

router.post('/user',userController.fetchUser)



module.exports = router