var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
   title: String,
    content: String,
    image_url: String,
    owner_id: String,
    owner_name: String,
    c_date: String
});

var U_post = mongoose.model('U_post', postSchema);
module.exports = U_post;