const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
console.log(process.env.DB_USER);
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he6ho.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error',err);
  const eventcollection = client.db('volunteer').collection("events");
  app.get('/events',(req, res)=>{
    eventcollection.find({})
    .toArray()
    .then(items=>{
      res.send(items)
    })
    .catch(err => console.error(`Failed to find documents: ${err}`))
  })
  app.post('/addEvent',(req, res)=>{
    const newEvent=req.body;
    console.log('adding event:',newEvent);
    eventcollection.insertOne(newEvent)
    .then(result=>{
      console.log('result',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  app.delete('delete/:id',(req, res)=>{
    const id=ObjectID(req.params.id)
    console.log('delete',id);
    eventcollection.findOneAndDelete({_id:id})
    .then(documents=>res.send(!!documents.value))
  })
  console.log('connected');
  // perform actions on the collection object
  
});




app.listen(port)