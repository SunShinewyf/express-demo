var mongoose = require('../db').mongoose;
var schmea = new mongoose.Schema({
    user: 'string',
    title: 'string',
    content: 'string',
    time: 'string',
});
var article = mongoose.model('Article',schmea);
module.exports = article;