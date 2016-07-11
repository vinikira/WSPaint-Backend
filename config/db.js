'use strict';
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wspaint', (err)=>{
	console.log('conectei no mongodb!!');
});
