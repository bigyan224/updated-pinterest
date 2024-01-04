require('dotenv').config();
const db =process.env.DATABASE_URI

console.log(db)
const mongoose =require("mongoose");
mongoose.connect(db,{})
.then(()=>{
  console.log("connected to database")
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});;
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
