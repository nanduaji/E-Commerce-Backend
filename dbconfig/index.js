const mongoose = require('mongoose');
const mongodbUriString = process.env.MONGO_URI;
mongoose.connect(mongodbUriString, {})
.then((response)=>{
    console.log('Connected to MongoDB');

}).catch((error)=>{
    console.log('Error connecting to MongoDB', error);
});