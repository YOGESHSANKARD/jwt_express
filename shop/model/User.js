const mongoose=require("mongoose");

const sch=mongoose.Schema({
    id:{type:Number,unique:true,required:true},
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    role:{type:String,default:"Customer"}
});
const User=mongoose.model("User",sch);
module.exports=User