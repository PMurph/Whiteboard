var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use('/api', function(req, res) {
    // Please define routes in a separate file and require() them in
    res.send('API routes go heeeere');
});

app.use('*', express.static(__dirname + '/../client/web/app'));

// TODO: Modify this if using pushstate on backbone
// app.use(function(req, res) {
//     var newUrl = req.protocol + '://' + req.get('Host') + '/#' + req.url;
//     return res.redirect(newUrl);
// });

console.log('listening on port: ' + port);
app.listen(port);
