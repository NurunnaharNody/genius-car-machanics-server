const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors =require('cors');
require('dotenv').config()

const app = express();

const port = 5000;

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.prsyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
      await client.connect();
      //console.log('connected to data');
      const database = client.db('carMechanic')
      const servicesCollection = database.collection('services');
        

      //Get API
      app.get('/services', async(req, res) =>{
          const cursor = servicesCollection.find({})
          const services = await cursor.toArray();
          res.send(services);
      })
        
      //gET sINGLE sERVICE
      app.get('/services/:id', async(req, res) =>{
          const id = req.params.id;
          console.log('gettinf specific service', id);
          const query = {_id : ObjectId(id) };
          const service = await servicesCollection.findOne(query);
          res.json(service);
      })
       //POST API

       app.post('/services', async(req, res) =>{
        const service = req.body;
        console.log('hiti', service)

        //  const service = {
        //     "name": "ENGINE DIAGNOSTIC",
        //     "price": "300",
        //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
        //  }

         const result = await servicesCollection.insertOne(service);
         console.log(result);

        res.send(result)
       });

       //delete api
       app.delete('/services/:id', async(req, res) =>{
           const id =req.params.id;
           const query ={_id:ObjectId(id)};
           const result = await servicesCollection.deleteOne(query);
           res.json(result);
        })


}
finally{
    //await client.close();
}
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running genius server');
});

app.listen(port, () =>{
    console.log('Running genius server on port', port);
})