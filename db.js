var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/test");
var db=mongoose.connection;
module.exports={
    "dbCon":db,
    "mongoose":mongoose
};