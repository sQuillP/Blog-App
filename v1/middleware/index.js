let middleware = {};


//Checks to see if the user is logged in
middleware.isLoggedIn = function(req,res,next) 
{
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}

//Prevent images that are thousands of characters long to be stored in the database.
middleware.checkURL = function(req,res,next) 
{
		if(req.body.image.length>325) {
		 	res.redirect('/signup');	
		} else {
			return next();
		}
}


middleware.checkCommentOwnership = function(req,res,next)
{
	
}


module.exports = middleware;