const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skg6sgn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const toyCollection = client.db("toyCollection").collection("toys");

    // test api
    app.get("/health", (req, res) => {
      res.send("all is well");
    });

    // create= post
    app.post("/postToy", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await toyCollection.insertOne(data);
      res.send(result);
    });

    // get = read
    app.get("/allToy/:text", async (req, res) => {
      // console.log(req.params.category);
      if (
        req.params.text == "sportsCar" ||
        req.params.text == "policeCar" ||
        req.params.text == "miniTruck"
      ) {
        const result = await toyCollection
          .find({ category: req.params.text })
          .toArray();
        return res.send(result);
      }
      const result = await toyCollection.find({}).toArray();
      res.send(result);
    });

    // update = patch
    app.patch("/toy/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          ...body,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // delete
    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(filter);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy car is running");
});

app.listen(port, () => {
  console.log(`toy car is running on port ${port}`);
});
