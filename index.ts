const express = require('express');
const router = express.Router();
const passport = require('passport');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('./src/session');
const passportMiddleware    = require('./src/auth');
const io = require('./src/socket')(app);

import User from "./src/data/entities/user";
import Room from "./src/data/entities/room";

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
		res.redirect('/rooms');
	}
	else{
		res.render('login', {
			success: req.flash('success')[0],
			errors: req.flash('error'), 
			showRegisterForm: req.flash('showRegisterForm')[0]
		});
	}
});

router.post('/login', passport.authenticate('local', { 
	successRedirect: '/rooms', 
	failureRedirect: '/',
	failureFlash: true
}));
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password };

	if(credentials.username === '' || credentials.password === ''){
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/');
	}else{
		User.findOne({'username':  req.body.username }, function(err, user){
			if(err) throw err;
			if(user){
				req.flash('error', 'Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			}else{
				User.create(credentials, function(err, newUser){
					if(err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					res.redirect('/');
				});
			}
		});
	}
});


router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/rooms',
		failureRedirect: '/',
		failureFlash: true
}));

router.get('/rooms', function(req, res, next) {
	Room.find(req.body.userId, function(err, rooms){
		if(err) throw err;
		res.render('rooms', { rooms });
	});
});

router.get('/chat/:id', function(req, res, next) {
	var roomId = req.params.id;
	Room.findById(roomId, function(err, room){
		if(err) throw err;
		if(!room){
			return next(); 
		}
		res.render('chatroom', { user: req.user, room: room });
	});
	
});


router.get('/logout', function(req, res, next) {
	req.logout();
	req.session = null;
	res.redirect('/');
});





const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
app.use(passportMiddleware.initialize());
app.use(passportMiddleware.session());


app.use('/', router);

//404
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.htm');
});

io.listen(port);