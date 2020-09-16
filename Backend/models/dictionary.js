const mongoose = require('mongoose')

const dictionarySchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    word : String,
    type : String,
    definition: String,
    example : String
})

module.exports = mongoose.model('Dictionary',dictionarySchema)