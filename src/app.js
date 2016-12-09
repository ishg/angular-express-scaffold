var express = require('express')
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

/* CONFIGURATION */

app.use(express.static(__dirname + '/public'));

/* ROUTES */

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

/* API CALLS */


/* START SERVER */
var PORT = process.env.UI_PORT || 9000;
app.listen(PORT);
console.log('MM-UI started on port ' + PORT)