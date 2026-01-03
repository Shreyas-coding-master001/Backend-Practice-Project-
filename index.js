const express = require("express");
const userModel = require("./modules/user");
const postModel = require("./modules/posts");
const db = require("./config/db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const isLogged = require("./middleware/Loggedin");

const app = express();

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


db();

app.get("/",(req,res)=>{
    res.render("index")
});


app.post("/signup", (req,res)=>{
    let {username, email, password} = req.body;
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt, async function(err,result){
            let user = await userModel.create({
                username,email,
                password: result
            });

            if(!user) return res.status(500).send("Something Wrong to send data to DataBase");
        })
    });

    res.send("<h1>Data Send Successfully</h1>");
});

app.post("/login",async (req,res)=>{    
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});

    if(!user) return res.status(500).send("Invalid Login");

    bcrypt.compare(password,user.password,function(err,result){
        if(!result) return res.status(500).send("Invalid  Password");
        console.log("Login Valid");   
    });

    let token = jwt.sign({email:email},"secret");
    res.cookie("token",token);
    res.redirect("/profile"); 
});

app.get("/profile", isLogged ,async (req,res)=>{
    let obj = jwt.verify(req.cookies.token,"secret");
    let user = await userModel.findOne({email: obj.email}).populate("posts");

    res.render("profile",{user});
});

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
});   

app.post("/posts/:id", async (req,res)=>{
    let {content} = req.body;
    let userID = req.params.id;
    const post = await postModel.create({
        user: userID,
        content: content
    });

    const user = await userModel.findOneAndUpdate({_id: userID},
        {$push: {posts: post._id}},
        {new: true}
    );


    if(!post) return res.status(400).send("Something went Wrong");

    res.redirect("/profile");
});

app.get("/like/:id", isLogged, async (req,res)=>{
    const post = await postModel.findOne({_id: req.params.id}).populate("user");

    if(post.LikedAcc.indexOf(req.user._id) === -1){
        post.LikedAcc.push(req.user._id);
    }else{
        post.LikedAcc.splice(post.LikedAcc.indexOf(req.user._id),1)
    }
    post.save();
    res.redirect("/profile");
});

app.get("/edit/:id", isLogged, async (req,res)=>{ 
    const user = req.user;
    const post = await postModel.findOne({_id: req.params.id});
    res.render("edit",{user,post});
});

app.post("/editpost/:id", isLogged, async (req,res)=>{
    const user = req.user;
    user.username = req.body.username;
    user.email = req.body.email;
    user.save();

    const post  = await postModel.findOneAndUpdate({_id: req.params.id},
        {content: req.body.content},
    );

    res.redirect("/profile");
})

app.listen(3000,()=>console.log("Server is Running at 3000"));