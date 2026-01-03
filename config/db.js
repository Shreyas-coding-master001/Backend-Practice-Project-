const mongoose = require("mongoose");

const Connetdb = async function(){
    try {
        await mongoose.connect("mongodb://localhost:27017/userData");
        console.log("DataBase Connected!!");
        
    } catch (error) {
        console.error("Error Connecting DB : \n",error);
    }
}

module.exports = Connetdb;