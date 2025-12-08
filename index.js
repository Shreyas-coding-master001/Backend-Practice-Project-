const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname, "styleSheet")));

app.set("view engine","ejs");


app.get("/",function(req,res){
    fs.readdir("./Files",(err,data)=>{
        if(err) console.error(err);
        else res.render("index",{files: data})
    })
});

app.post("/create",(req,res)=>{
    fs.writeFile(`./Files/${req.body.fileName}.txt`,`${req.body.Description}`,(err)=>{
        if(err) console.error(err);
        else res.redirect("/");
    });
});

app.get("/Files/:filename",(req,res)=>{
    fs.readFile(`./Files/${req.params.filename}`,'utf-8',(err,data)=>{
        if(err) console.error(err.message);
        else res.render("show",{file: data, fileName: req.params.filename});
    });
});

app.get("/edit/:filename",(req,res)=>{
    res.render("Edit",{file: req.params.filename})
});

app.post("/Edit/:filename",(req,res)=>{
    fs.rename(`./Files/${req.params.filename}`,`./Files/${req.body.Renamed}`,(err)=>{
        if(err) console.error(err.message);
        else res.redirect("/");
    });
});

app.listen(3000,()=>console.log("Server is running!!"));