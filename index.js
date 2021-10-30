const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 5000
const uri = `mongodb+srv://sajek:${process.env.DB_PASS}@cluster0.2blon.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
  res.send('Hello World!')
  client.connect(err => {
    const servicesCollection = client.db(process.env.DB_NAME).collection("services");
    
  });
})
app.get('/add-service', (req, res) => {
  client.connect(err => {
    const servicesCollection = client.db(process.env.DB_NAME).collection("services");
    
  });
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})