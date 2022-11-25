const bookModel = require("../Models/BookModels")


const addBooks = async (req, res) => {
    try {
            const bookDoc = await bookModel.create(req.body)
            res.status(201).json({data:bookDoc,message: "Book added successfully"})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const fetchBooks = async (req, res) => {
    try {
        const filter = req.body
        
        const regexName = new RegExp(filter.title,"i")
        filter.title = {$regex:regexName}

        const bookList = await bookModel.find(filter)
        if(bookList.length ===0){
            res.status(200).send({message:"book not found , provide title or ISBN No"})
        }else{
            res.status(200).send({success:true,data:bookList})
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


module.exports={
    addBooks,fetchBooks }