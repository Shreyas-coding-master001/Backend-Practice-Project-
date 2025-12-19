const express = require("express");
const userSchema = require("./modules/user");
const app = express();
let port = 3000;

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/read",async (req,res)=>{

    let userdata = await userSchema.find({});

    res.render("read",{userdata});
    // res.send(userdata);
});

app.post("/create",(req,res)=>{
    let {name,age,image} = req.body;

    userSchema.create({
        name: name,
        age: age,
        image: image
    })
    
    res.redirect("/read");
});

app.get("/edit/:id",async (req,res)=>{
    let user = await userSchema.findOne({_id: req.params.id});
    res.render("edit",{user});
    
});
app.post("/edit/user/:id",async (req,res)=>{
    let {name,age,image} = req.body;

    await userSchema.findOneAndUpdate({_id: req.params.id},{name:name,age:age,image:image});

    res.redirect("/read");
    
});

app.get("/delete/:id",async (req,res)=>{
    let userDelete = await userSchema.deleteOne({_id: req.params.id});

    res.redirect("/read");
});

app.listen(port,()=>console.log(`Server is running at ${port}`));