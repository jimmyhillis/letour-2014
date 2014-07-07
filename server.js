/**
 * Simple node + connect based static web server for
 * quick front end development. Usage:
 *
 * > node server.js
 *
 * This will run a server for viewing static websites from the current
 * root as well as the ./public/ directory. For access open your
 * browser and to http://localhost:3000/html/
 *
 */

var connect = require('connect');
var http = require('http');
var app = connect();

app.use(connect.logger('dev')); // enable full server logging
app.use(connect.static('public'));
app.use(connect.static('public/html'));
app.use(function (req, res) {
    res.end('404. There is no such file.');
});
app.listen(3000);
