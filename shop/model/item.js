const mongoose=require('mongoose');
var sch=mongoose.Schema({
    id:{type:Number,unique:true},
    itemName:{type:String,required:true},
    mrp:{type:Number,required:true},
    quantity:{type:Number,required:true},
    updatedDate:{type:Date,default:Date.now}
});
module.exports=mongoose.model('Item',sch);