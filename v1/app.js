let express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	LocalStrategy = require('passport-local'),
	passport = require('passport'),
	//This will be moved to a different file
	passportLocalMongoose = require('passport-local-mongoose'),
	middleware = require('./middleware/index.js'),
	//models
	Comment = require('./models/comment.js'),
	Blog = require('./models/blog.js'),
	User = require('./models/user.js'),
	
	//getting the routes
	blogRoutes = require('./routes/blog.js'),
	indexRoutes = require('./routes/index.js');



//TODO:: edit and delete comments.
	

mongoose.connect('mongodb://localhost:27017/crud_v1',{
	useNewUrlParser: true,
	useUnifiedTopology:true
}).then(()=>console.log('connected to Crud_v1'))
.catch(err=>console.log(err));


//Allow for body-parser to retreive information from forms
app.use(bodyParser.urlencoded({extended:true}));

//Use the _method for different RESTful routes
app.use(methodOverride('_method'));

//serve the files in the public directory
app.use(express.static(__dirname+'/public'));

//Allow for ejs file extensions to not be included in when rendering files in the string parameter
app.set('view engine','ejs');

app.use(require('express-session')({
	secret: "I don't know what this function is for",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use(function(req,res,next) {
	//req.user now does not need to be passed into all rendered ejs files.
	res.locals.currentUser = req.user;
	next();
})

app.use('/blogs',blogRoutes);
app.use(indexRoutes);


//Listen on port 3000
app.listen(3000,function(){
	console.log('V1 CRUD has started');
});
