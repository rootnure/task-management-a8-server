const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3al0nc5.mongodb.net/?retryWrites=true&w=majority`;

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

    const taskCollection = client.db("taskManagement").collection("tasks");

    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const receivedData = req.body;
      console.log(receivedData);
      const dataToAdd = {
        email: receivedData.email,
        title: receivedData.title,
        description: receivedData.description || null,
        deadline: receivedData.deadline || null,
        priority: receivedData.priority || "low",
        status: "todo",
      };
      const result = await taskCollection.insertOne(dataToAdd);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
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
  res.send({ status: "success", message: "Server is online..." });
});

app.listen(port, () => {
  console.log(`Server is online in port ${port}`);
});
