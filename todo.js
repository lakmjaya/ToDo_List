const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name: String , age: String, location: String
})

module.exports = mongoose.model("Todo", schema)