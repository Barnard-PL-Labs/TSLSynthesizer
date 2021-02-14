// https://stackoverflow.com/a/63961022/11801882
// https://nodejs.org/api/synopsis.html
// set up plain http server
const express = require('express');
const app = express();
const http = require('http');
const hostname = "tslsynthesissynthesizer.com";
const port = 80;

// set up a route to redirect http to https
app.get('*', function(req, res) {
	redirect_url = 'https://' + req.headers.host + req.url;
	res.redirect(redirect_url);
})

app.listen(port, hostname, () => {
  console.log(`Redirecting to https.`);
});
