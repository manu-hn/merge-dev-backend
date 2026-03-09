const {connect, } = require("mongoose");
require('dotenv').config();

const connectDB = async ()=>{
    await connect(process.env.MERGE_DEV_MONGO_DB_SECRET);   
    
}

module.exports = {connectDB} 