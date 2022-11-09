const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rvsy5g6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('repairService').collection('services');
        const reviewCollection = client.db('repairService').collection('reviews');

        app.get('/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singleService = await serviceCollection.findOne(query);
            res.send(singleService);
        })

        app.get('/reviews', async(req,res)=> {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email,
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));



app.get('/',(req,res)=> {
    res.send('Server is running');
})

app.listen(port,()=>{
    console.log(`Server is running under ${port}`);
})