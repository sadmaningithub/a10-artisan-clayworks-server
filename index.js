const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vtceto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const artStoreCollection = client.db('artDB').collection('arts')

    app.get('/items', async(req, res)=>{
      const cursor = artStoreCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/items/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id)
      const query = {_id: new ObjectId(id)};
      // console.log(typeof query._id)
      const result = await artStoreCollection.findOne(query);
      res.send(result);
    })

    app.get('/user/:email', async(req, res)=>{
      const email = req.params.email;
      // console.log(typeof req.params.email)
      const query = { mail: email}
      const result = await artStoreCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/items',async(req,res)=>{
      const newItem = req.body;
      // console.log(newItem)
      const result = await artStoreCollection.insertOne(newItem);
      res.send(result);
    })

    app.delete('/items/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await artStoreCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Artisan Clayworks server is running.');
})

app.listen(port, ()=>{
    console.log(`Artisan Clayworks is running on port ${port}`)
})