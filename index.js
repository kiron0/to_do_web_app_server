const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@kiron.ripcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("taskCollection").collection("tasks");

    app.get("/tasks", async (req, res) => {
      const tasks = await taskCollection.find({}).toArray();
      res.send(tasks);
    });

    // task post
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    // task delete
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("K Task TO DO is Calling You!");
});

app.listen(port, () => {
  console.log(`K Task TO DO app listening on port ${port}`);
});
