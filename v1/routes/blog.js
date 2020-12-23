let express = require('express'),
	router = express.Router(),
	Blog = require('../models/blog.js'),
	middleware = require('../middleware/index.js'),
	Comment = require('../models/comment.js');



//SHOW the index of blogs
router.get('/',function(req,res) {
	
	Blog.find({}).populate('author').exec(function(err,blogs){
		if(err){
			console.log(err)
		} else{
			res.render('index',{blogs:blogs});
		}
	});
	
});


//SHOW blog page for making a new blog
router.get('/new',middleware.isLoggedIn,function(req,res) {
	res.render('new');
})


//SHOW one blog
router.get('/:id',middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id).populate('comments').populate('author')
	.exec(function(err,foundBlog){
		if(err){
			console.log(err);
		} else {
			res.render('show',{blog:foundBlog});
		}
	});
});


//SHOW the edit page for a blog
router.get('/:id/edit',function(req,res) {
	Blog.findById(req.params.id,function(err,foundBlog) {
		if(err){
			console.log(err);
		} else {
			res.render('edit',{blog:foundBlog});
		}
	});
});


//render the editComment page
router.get('/:id/comments/:commentID',function(req,res){
	Comment.findById(req.params.commentID,function(err,comment){
		if(err){
		 console.log(err)
		} else {
		 res.render('editComment',{comment:comment, blog_id:req.params.id});	
		}
	});
	
});


//POST create a new blog and save it to the database
router.post('/',function(req,res) {
	let blog = req.body.blog;
	blog.author = req.user._id;
	//Create a blog in the database
	Blog.create(blog,function(err,createdBlog) {
		if(err){
			console.log(err);
		} else {
			res.redirect('/blogs')
		}
	});
});



//Create a comment, adding it to the database and assoiciating it with campground
router.post('/:id/comments',middleware.isLoggedIn,function(req,res) {
	//add comment to the database
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
		} else {
			//Add only the blog content to the database
			Comment.create({content: req.body.content},function(err,newComment){
				if(err){
					console.log(err);
				} else {
					//add the extra data to the comment, save the comment, then push to the current blog.
					newComment.author.id = req.user._id;
					newComment.author.name = req.user.username;
					newComment.author.image = req.user.image;
					newComment.save();
					blog.comments.push(newComment);
					blog.save();
					res.redirect('/blogs/'+blog._id);
				}
			});
		}
	});
});

//DELETE comemnt
router.delete('/:id/comments/:commentID',function(req,res){
	//Delete the current 
	Comment.findByIdAndDelete(req.params.commentID,function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/blogs/'+req.params.id);
		}
	});
});


//EDIT comment
router.put('/:id/comments/:commentID',function(req,res){
	Comment.findByIdAndUpdate(req.params.commentID,req.body.comment,function(err,editedComment){
		if(err){
			console.log(err);
		} else {
			res.redirect('/blogs/'+req.params.id);
		}
	});
});




router.put('/:id',function(req,res) {
	//update the item in the database
	//the first argument is the id, second argument are the changes, the third is the callback function
	//where the two parameters are the error and the updated blog
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
		} else {
			res.redirect('/blogs/'+req.params.id);
		}
	});
});


//delete a blog
router.delete('/:id',function(req,res){
	Blog.findByIdAndDelete(req.params.id,function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/blogs');
		}
	});
});


module.exports = router;

