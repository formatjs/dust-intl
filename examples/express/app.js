var
    express     = require('express'),
    dust        = require('dustjs-linkedin'),
    consolidate = require('consolidate'),
    app         = express(),
    dustIntl;

// These are our polyfills.
global.Intl              = require('intl');
global.IntlMessageFormat = require('intl-messageformat');

dustIntl = require('../../lib/helpers');
dustIntl.register(dust);

app.engine('dust', consolidate.dust);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.set('port', 3000);


// middleware for setting up the locale
app.get('*', function(req, res, next) {
    res.locals.intl = {};
    res.locals.intl.messages = {
        FROM: "from request: {num, number, integer}"
    };

    //// This is the best approach...
    //res.locals.intl.locale = req.acceptedLanguages[0];
    //// ...but for our testing we'll fake a German user.
    res.locals.intl.locale = 'de-DE'

    next();
});


app.get('/', function(req, res) {
    res.render('index', {NUM: 40000});
});


app.listen(app.get('port'), function() {
    console.log('- listening on http://localhost:' +  app.get('port') + '/');
});
