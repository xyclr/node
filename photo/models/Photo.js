/**
 * Created by cdgoujianjun on 2015/4/13.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photo_app');

var schema = new mongoose.Schema({
    name : String,
    path : String
});

module.exports = mongoose.model('photo', schema);
