const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// ToDo
// eGZGfSRW4gXKnhvx

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.mhwjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const Database = client.db("ToDo");
        const userCollection = Database.collection("users");
        const taskCollection = Database.collection("tasks");


        app.post('/users', async (req, res) => {
            const user = req.body;

            const exist = await userCollection.findOne({ email: user.email });
            if (exist) {
                console.log(user.email, 'already exists');
                return;
            }
            
            const result = await userCollection.insertOne(user);
            res.send(result)
        })


        // task related
        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.send(tasks);
        })
        
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { user_email: email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })

        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const  category =  req.body
            const query = { _id: id };
            const update = { 
                $set: category 
            };
            const options = { upsert: true };
            const result = await taskCollection.updateOne(query, update, options);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // Ensures that the client will close when you finish/error
        // await client.close();

    }
}
run().catch(console.dir);


// Routes
app.get('/', (req, res) => {
    res.send('ToDo Server');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});