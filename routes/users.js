const mongoose =require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/updated_pinterest");
const plm=require("passport-local-mongoose")

const userSchema = mongoose.Schema({
username: String,
fullName: String,
password: String,
profileImage: String,
contact: Number,
boards:{
  type:Array,
  default:[]
},
posts:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"post",
  },
],

})

userSchema.plugin(plm);

module.exports=mongoose.model("user",userSchema)
