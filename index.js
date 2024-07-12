const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://aravind:12345@cluster0.kogcctt.mongodb.net/project')
const db=mongoose.connection;

db.on('open',()=>{
    console.log('connected')
})

db.on('error',()=>{
    console.log('not connected')
})

app.use(express.json());

const authRoutes = require('./controllers/auth');
const movieRoutes = require('./controllers/movies');

  app.use('/auth',authRoutes)
  app.use('/movies',movieRoutes)

app.listen(9000,()=>{
    console.log('server listening on port 9000')
})
