const userModel = require("../modules/user");
const jwt = require("jsonwebtoken");    

async function isLogged(req,res,next){
    if(req.cookies.token === undefined || req.cookies.token === "") return res.redirect("/");
    else{
        const token = jwt.verify(req.cookies.token,"secret");
        req.user = await userModel.findOne({email: token.email});
    }
    next();
}

module.exports = isLogged;