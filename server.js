// Load modules.
// It is good practice to put includes and modules at the top of your files.
var _ = require('underscore');
var BigNumber = require('bignumber.js');
var bodyParser = require('body-parser');
var express = require('express');
var exphbr = require('express-handlebars');
var session = require('express-session');

// Create our express app.
var app = express();

// Parse data from HTML forms (like from our login page).
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize session middleware.
// Sessions allow our app to remember visitors from one request to the next.
app.use(session({
	secret: 'not so secret',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, httpOnly: false }
}))

// Setup the templating middleware.
// This allows us to use some logic and inject data into HTML templates before sending to the browser.
app.engine('html', exphbr({
	defaultLayout: 'main',
	extname: '.html'
}));

app.set('view engine', 'html');

// Create a helper function to require login for some routes.
var requireLogin = function(req, res, next) {

	if (!req.session.user) {
		// This request is from a user that is not logged in.
		// Send them to the login page.
		return res.redirect('/login');
	}

	// If we got this far, the request is from a logged-in user.
	// Continue on to other middleware or routes.
	next();
};

app.get('/', requireLogin, function(req, res, next) {

	res.render('home', {
		username: req.session.user.name,
		balance: accounts[req.session.user.name] || 0
	});
});

// Super simple login system.
// This is not how real login systems should work.
var validLogins = [
	{ username: 'bob', password: 'test' },
	{ username: 'alice', password: 'test' }
];

app.get('/login', function(req, res, next) {

	res.render('login');
});

app.post('/login', function(req, res, next) {

	if (!req.body.username) {
		return res.send('Username is required.').status(400);
	}

	if (!req.body.password) {
		return res.send('Password is required.').status(400);
	}

	var user = _.find(validLogins, function(login) {
		return login.username === req.body.username && login.password === req.body.password;
	});

	if (!user) {
		return res.send('Invalid username or password.').status(400);
	}

	// Valid login.
	// Create a new session and save their user data in the session.
	req.session.regenerate(function(error) {

		if (error) {
			console.log(error);
			return res.send('An unexpected error occurred.').status(500);
		}

		req.session.user = { name: user.username };
		res.redirect('/');
	});
});

// Funds transfer with HTTP GET request.
// It is generally a bad idea to modify state via GET requests.
app.get('/transfer', requireLogin, function(req, res, next) {

	transferFunds(
		req.query.to,
		req.session.user.name,
		req.query.amount,
		function(error) {

			if (error) {
				return res.send(error.message).status(400);
			}

			// Successfully transferred funds.
			// Redirect the user back to the home page.
			res.redirect('/');
		}
	);
});

// Funds transfer with HTTP POST request.
// This is safer than using a GET request, but is still vulnerable to some attack vectors.
app.post('/transfer', requireLogin, function(req, res, next) {

	transferFunds(
		req.body.to,
		req.session.user.name,
		req.body.amount,
		function(error) {

			if (error) {
				return res.send(error.message).status(400);
			}

			// Successfully transferred funds.
			// Redirect the user back to the home page.
			res.redirect('/');
		}
	);
});

// Simple accounts ledger.
// This information would normally be stored in a database like MySQL, PostgreSQL, etc.
var accounts = {
	bob: '500',
	alice: '500'
};

var transferFunds = function(to, from, amount, cb) {

	if (!to) {
		return cb(new Error('"To account" is required.'));
	}

	if (!from) {
		return cb(new Error('"From account" is required.'));
	}

	if (!accounts[to]) {
		return cb(new Error('Cannot transfer funds to non-existent account ("' + to + '").'));
	}

	if (!accounts[from]) {
		return cb(new Error('Cannot transfer funds from non-existent account ("' + from + '").'));
	}

	if (!amount) {
		return cb(new Error('"Amount" is required.'));
	}

	try {
		amount = new BigNumber(amount);
	} catch (error) {
		return cb(new Error('Amount must be a valid number.'));
	}

	console.log('Transferring funds (' + amount + ') from "' + from + '" to "' + to + '"');

	accounts[to] = (new BigNumber(accounts[to])).plus(amount).toString();
	accounts[from] = (new BigNumber(accounts[from])).minus(amount).toString();

	console.log('New account balances:');
	console.log(JSON.stringify(accounts, null, 2));

	cb();
};

// This tells our express application to listen for local requests on port 3000.
app.listen(3000, function() {
	console.log('Server started and listening at localhost:3000');
});

// --------------------------------------------
// ---------- "Evil" app starts here ----------
// --------------------------------------------

// Let's make another express app.
var evilApp = express();

// Templating middleware.
evilApp.engine('html', exphbr({
	defaultLayout: 'main',
	extname: '.html'
}));

evilApp.set('view engine', 'html');

evilApp.get('/', function(req, res, next) {
	res.render('evil-examples');
});

evilApp.get('/malicious-form', function(req, res, next) {
	res.render('malicious-form');
});

// Our evil app will listen on port 3001.
evilApp.listen(3001, function() {
	console.log('"Evil" server started and listening at localhost:3001');
});
