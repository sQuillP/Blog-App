let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
	content: String,
	author: 
	{
		//This will be populated
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		name: String,
		image:String
	}
});

module.exports = mongoose.model('Comment',commentSchema);
