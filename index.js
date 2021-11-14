const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6afp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



  async function run() {
      try {
        await client.connect();
        console.log('Database connected')

      
        
         //  database and collection
         const database = client.db('bikes-shop-database');
         const productsCollection = database.collection('products');


         
      
         //Get products Api
         app.get('/products', async(req, res) => {
          const cursor  = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products);
      })

 


      }
  finally {
      // Ensures that the client will close when you finish/error
    // await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Motoz Lover!')
  })
  
  app.listen(port, () => {
    console.log(`Motoz at http://localhost:${port}`)
  })
  