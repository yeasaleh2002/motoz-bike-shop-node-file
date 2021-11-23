const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');

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
         
         // products collection
         const productsCollection = database.collection('products');
         
         // order collection
         const ordersCollection = database.collection('oders');
      
         // ---------------user information collection in database------------------
         const usersCollection = database.collection('users');
      

         // ---------------- review collection in database --------------
         const reviewsCollection = database.collection('reviews')






         /* --------------------- user part start--------------------------- */
         
          // --------- check admin ? admin check korar process----------
          app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
              isAdmin = true;
            }
            res.json({ admin: isAdmin });
          })
         

         //-------- add or post data for users-----------
              app.post('/users', async (req , res) => {
              const user = req.body;
              const result = await usersCollection.insertOne(user);
              res.json(result)
          });


              // --------- make admin for dashboard --------
              app.put('/users/admin', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const updateDoc = { $set: {role: 'admin'}};
                const result = await usersCollection.updateOne(filter, updateDoc);
                res.json(result);
              })
     
              /* ------------------user part end ---------------------------- */



      /* --------------------- product part start-------------------- */

         //Get products Api
         app.get('/products', async(req, res) => {
          const cursor  = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products);
      })
 
        //GET single product
        app.get('/products/:id', async (req, res) => {
          const id = req.params.id;
          const  query = { _id: ObjectID(id) };
          const product = await productsCollection.findOne(query);
          res.json(product);
      })


      // POST product
      app.post('/products', async (req, res) => {
             
          const addProduct = req.body;       
          const result = await productsCollection.insertOne(addProduct);
          console.log(result);
          res.json(result)        
     });

     
      // ----------- delete product--------------
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectID(id)};
        const result = await productsCollection.deleteOne(query);         
        res.send(result);
    });

     /* ----------------------product part end --------------------- */




       /* ----------------Review Part Start--------------------- */

              //Get review Api
              app.get('/reviews', async(req, res) => {
                const cursor  = reviewsCollection.find({});
                const reviews = await cursor.toArray();
                res.send(reviews);
            })

            
            // POST review
            app.post('/reviews', async (req, res) => {                 
                const addReview = req.body;             
                const result = await reviewsCollection.insertOne(addReview);             
                res.json(result)        
            });

       /* ----------------- Review part End------------------- */




  
      /* ------------ Order part start---------------- */


     
        //----------- get my Order---------- 
        app.get('/oders', async ( req, res) => {
                    
          const email = req.query?.email;
          const query = {email : email}
          console.log( query)

          const cursor = ordersCollection.find(query);
          const orders = await cursor.toArray();
          res.json(orders);
        })


      //-------- post data for orders-------
      app.post('/oders', async (req , res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json(result)
      });
      
 
      // ----------- delete orders--------------
            app.delete('/oders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectID(id)};
            const result = await ordersCollection.deleteOne(query);         
            res.send(result);
        });


     /* -----------------order part end --------------------------*/


      }
  finally {
      // Ensures that the client will close when you finish/error
    // await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Motoz Lover!Are You Ready???')
  })
  
  app.listen(port, () => {
    console.log(`Motoz at http://localhost:${port}`)
  })
  