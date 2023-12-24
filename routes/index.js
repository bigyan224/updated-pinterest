var express = require('express');
var router = express.Router();
const userModel=require("./users");
const postModel=require("./posts")
const passport = require('passport');
const localStrategy=require("passport-local")
const upload = require("./multer")

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/',async  function(req, res, next) {
  const posts= await postModel.find()
  .populate("user")
  res.render("feed",{posts,nav:true})
});
router.get('/login', function(req, res, next) {
  res.render('login',{nav:false});
});
router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user=
   await userModel
   .findOne({username:req.session.passport.user})
   .populate("posts")
  await res.render('profile', { username: req.user.username, fullName: req.user.fullName, user,nav:true });
});

router.post('/register', function(req, res, next) {
  const data= new userModel({
    username: req.body.username,
    fullName:req.body.fullName,
    email: req.body.email,
    contact: req.body.contact
  })
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
});

router.post('/login',passport.authenticate("local", {
  failureRedirect:"/",
  successRedirect:"/profile"
}), function(req, res, next) {

});
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.get('/create_post',isLoggedIn, async function(req, res, next) {
  const user=await userModel.findOne({username: req.session.passport.user})
res.render("create_post",{user,nav:true})
});
router.post('/create_post',isLoggedIn,upload.single("post_image"),async function(req, res, next) {
  const user=await userModel.findOne({username: req.session.passport.user})
 const post=await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename,
  })
  user.posts.push(post._id);
  await user.save()
  res.redirect("/profile")
});


router.post('/upload_img', isLoggedIn,upload.single("image"), async function(req, res, next) {
const user= await userModel.findOne({username:req.session.passport.user});
user.profileImage = req.file.filename;
await user.save();
res.redirect("/profile")
});

router.get("/show/posts",isLoggedIn,async function(req,res){
  const user=
  await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts")
  res.render("show_posts",{user,nav:true})
})


router.get("/show/posts/:postId",isLoggedIn,async function(req,res){
  const postId=req.params.postId;
  const post= await postModel.findById(postId)
  .populate("user")
  res.render("single_post",{post,nav:true})
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}

module.exports = router;
