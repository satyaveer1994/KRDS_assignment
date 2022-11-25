const userModel = require("../Models/UserModel")
const bookModel = require("../Models/BookModels")


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "1003440893268-drkdse67im2bad4c4mfll07aufdcp84t.apps.googleusercontent.com", // Your Credentials here.
    clientSecret: "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", // Your Credentials here.
    callbackURL: "http://localhost:5000/api/auth/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));


const login = async (req, res) => {
    try {
        let profile = req.user;
        if (!req.user)
            return res.redirect('api/auth');

        let userDoc = {
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos,
            token: profile.id
        }

        let isExist = await userModel.findOne({ email: profile.emails[0].value })

        if (isExist) return res.status(200).json({ success: true, data: isExist, message: "login successfull" })

        let document = await userModel.create(userDoc)
        return res.status(200).json({ success: true, data: document, message: "login successfull" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const fetchUser = async (req, res) => {
    try {
         const filter = req.body
         
        const {name,email} = filter
        
        const regexName = new RegExp(name, "i");
        filter.name = { $regex: regexName }

        const userDoc = await userModel.find(filter).populate({
            path:'personalList',
            select:'title ISBN image'
        })

        if(userDoc.length === 0) return res.status(404).json({ message: "No user found, try with user's name or emailId" })
        return res.status(200).json({ success: true, data: userDoc })
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const addToList = async (req, res) => {
    try {
        let userId = req.params.id
        let data = req.body

        if (!data.bookId) return res.status(400).json({ message: "body is empty, provide bookId  to add in your list" })
        const book = await bookModel.findById(data.bookId)
        if (!book) return res.status(404).json({ message: "No book found" })
        const bookId = book._id

        const list = await userModel.findOneAndUpdate(
            { _id: userId },
            { $push: { personalList: bookId } }, { new: true })

        return res.status(201).json({ data: list, message: "Book added to your personal list" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
const removeBookFromList = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) return res.status(400).json({ message: "Id params missing, gave UserId to continue" })

        const data = req.query;

        if (!data) return res.status(400).json({ message: "Gave a 'bookId' or Book's 'title' or 'ISBN' to remove from your list" })

        const Book = await bookModel.findOne(data)
        if (!Book) return res.status(404).json({ message: `Book not found with ${data}` })

        const isExist = await userModel.findById(userId);

        const listExist = isExist.personalList.includes(Book._id)


        if (listExist) {
            const removedList = await userModel.findByIdAndUpdate(userId, {
                $pull: { personalList: Book._id }
            }, { new: true })
            return res.status(200).json({ success: true, data: removedList, message: `Book removed from your personal list` })
        } else {
            return res.status(404).json({ success: false, message: `'${Book.title}' book is not present in your personal list` })
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
const deleteList =async (req,res) => {
    try {
        const userId = req.params.id;

        const isExist = await userModel.findById(userId)
        if(isExist){
            await userModel.findByIdAndUpdate(userId,
            {$set:{personalList:[]}},
            {new:true})
            return res.status(200).send({message:"Your personal list is deleted"})
        }else{
            return res.status(404).send({message:`No user find, check the userid -${userId}`})
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


module.exports = {
    login, addToList, fetchUser, removeBookFromList ,deleteList
}