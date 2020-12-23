let express = require('express'),
	router = express.Router(),
	middleware = require('../middleware/index.js'),
	passport = require('passport'),
	User = require('../models/user.js');

//SHOW the home page
router.get('/',function(req,res) {
	res.render('home');
});


//SHOW login page
router.get('/login',function(req,res) {
	res.render('login');
});

router.get('/signup',function(req,res) {
	res.render('signup');
});


router.get('/logout',function(req,res) {
	req.logout();
	res.redirect('/');
});


router.post('/login',passport.authenticate('local',{
	successRedirect:'/blogs',
	failureRedirect:'/login'
	}),function(req,res){
});


//Create a new user and add to the database
router.post('/signup',middleware.checkURL,function(req,res){
	let newUser = new User({username:req.body.username, image: req.body.image});
	//create the user with all the attributes except the password
	//pass in the user object with everything but the password in the first parameter
	//pass in the password in the second parameter
	User.register(newUser,req.body.password,function(err,nUser) {
		if(err){
			console.log(err);
			return res.render('signup');
		} else {
			//tricky syntax here
			passport.authenticate('local')(req,res, function() {
				res.redirect('/blogs');
			});
		}
	});
});


module.exports = router;