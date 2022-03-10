// This lays out a simple Express based Todo List API
// The CRUD operations are available for a given Mongo Atlas connection
// and Todo List Schema/Model

// Import Express 
const express = require("express")

// Import Mongoose
const mongoose = require("mongoose")

// Import Todo Model
const Todo = require("./todo")

// Database Name
const databaseName = "todolist"

// Create a Connection String
const connectionString = "mongodb+srv://Dunstant:<Password I removed>@cluster0.wj7sl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Function called when our app starts
async function launch() {

    // Connect to MongoDB database
    mongoose
        .connect(connectionString)
        .then(() => {

            // Create Express App Object
            const app = express()

            // Welcome Message
            app.get('/', function(req, res) {
            res.send("<H1>Welcome  to ToDo List!</H1> <H2>Enter URL http://localhost:3000/api/todos</H2>")
            });

            // Tell App to use JSON for requests & responses
            app.use(express.json()) 
            
            // API Route to get All Todo List Items
            app.get("/api/todos", async (req, res) => {
                // https://mongoosejs.com/docs/api.html#model_Model.find
                const todos = await Todo.find()
                res.send(todos)
            })

            // API Route to get a Single Todo List Item
            app.get("/api/todos/:id", async (req, res) => {
                try {
                    //https://mongoosejs.com/docs/api.html#model_Model.findOne
                    const todo = await Todo.findOne({ _id: req.params.id })
                    res.send(todo)
                } catch {
                    res.status(404)
                    res.send({ error: "Todo doesn't exist!" })
                }
            })

            // API Route to Create a New Todo List Item
            app.post("/api/todos", async (req, res) => {

                // Create a new Model
                const newTodo = new Todo({
                    name: req.body.name, age: req.body.age, location: req.body.location,
                })

                //https://mongoosejs.com/docs/documents.html#updating-using-save
                await newTodo.save()

                res.send(newTodo)
            })

            // API Route to Update an existing Todo List Item
            app.patch("/api/todos/:id", async (req, res) => {
                try {
                    //https://mongoosejs.com/docs/api.html#model_Model.findOne
                    const updatedTodo = await Todo.findOne({ _id: req.params.id })
            
                    // If our request contains a Name
                    if (req.body.name) {

                        // Update the Model
                        updatedTodo.name = req.body.name
                    }

                    // If our request contains a Age
                    if (req.body.age) {

                        // Update the Model
                        updatedTodo.age = req.body.age
                    }

                    // If our request contains a Location
                    if (req.body.location) {

                        // Update the Model
                        updatedTodo.location = req.body.location
                    }

            
                    //https://mongoosejs.com/docs/documents.html#updating-using-save
                    await updatedTodo.save()

                    res.send(updatedTodo)
                } catch {
                    res.status(404)
                    res.send({ error: "Todo doesn't exist!" })
                }
            })

            // API Route to Remove an Exisiting Todo List Item
            app.delete("/api/todos/:id", async (req, res) => {
                try {
                    // https://mongoosejs.com/docs/api.html#model_Model.deleteOne
                    await Todo.deleteOne({ _id: req.params.id })

                    // No response content - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204 
                    res.status(204).send()
                } catch {
                    res.status(404)
                    res.send({ error: "Todo doesn't exist!" })
                }
            })

            // Extra function to close the DB connection
            app.get("/exit", async (req, res) => {
                // Close our DB Connection
                // https://mongoosejs.com/docs/api.html#mongoose_Mongoose-disconnect
                mongoose.disconnect()

                res.send("DB Connection Closed")
            })

            // Tell Express Application to listen on port 3000
            app.listen(3000, () => {
                console.log("Server has started!")
            })
        })
}

// Call to launch function to start App Logic
launch()