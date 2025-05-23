const express=require('express');
const app=express();
require('dotenv').config();
const port=3002;

const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdb',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{console.log("Db connected Successfully")})
.catch(err=>{console.error(e)});

const item=require('./routes/ItemRouter');
const auth=require('./routes/AuthRouter');
app.use(express.json());

app.use('/api/auth',auth);
app.use('/api/item',item);

app.listen(port,()=>{
    console.log(`server running in http://localhost:${port}/`);
});