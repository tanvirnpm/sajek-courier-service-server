const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2blon.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");

        // insert service
        app.post("/addService", async(req, res) => {
            const receivedService = req.body;
            const result = await serviceCollection.insertOne(receivedService);
            res.json(result);
        });

        // get all service
        app.get("/getService", async(req, res) => {
            serviceCollection.find({}).toArray((err, documents) => {
                res.send(documents);
            });
        });

        // get all orders
        app.get("/getAllOrders", async(req, res) => {
            orderCollection.find({}).toArray((err, documents) => {
                res.send(documents);
            });
        });

        // get single service details
        app.post("/serviceDetails", async(req, res) => {
            const receivedServiceId = req.body;
            const objectServiceId = new ObjectId(receivedServiceId.serviceId)
            serviceCollection.find({ _id: objectServiceId }).toArray((err, documents) => {
                res.send(documents[0].data);
            });
        });

        // get single order list with details
        app.post("/getMyOrders", async(req, res) => {
            const receivedUserEmail = req.body;
            orderCollection.find({ "user.email": receivedUserEmail.email }).toArray((err, documents) => {
                res.send(documents);
            });
        });

        // make an order with service details and user information
        app.post('/makeAnOrder', async(req, res) => {
            const receivedOrderInformation = req.body;
            const result = await orderCollection.insertOne(receivedOrderInformation, (err, documents)=>{
                res.send(documents)
            });
            // res.send(receivedOrderInformation)
        })

        // delete orders by order id
        app.post("/deleteOrderByOrderId", async(req, res) => {
            const receivedOrderId = req.body;
            const objectOrderId = new ObjectId(receivedOrderId.o_id)
            orderCollection.deleteOne({ _id: objectOrderId },(err, documents) => {
                // res.send(documents[0].data);
                res.send(documents); 
            });
            // res.send(objectOrderId)
        });

        // order active now
        app.patch('/orderActive/:id', (req,res)=>{
            const id = req.params.id;
            res.send(id)
        })



    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server running at port", port);
});