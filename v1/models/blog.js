let mongoose = require('mongoose');

let blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	caption: String,
	content: String,
	
	author: 
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Comment'
		}
	]
});


module.exports = mongoose.model('Blog',blogSchema);