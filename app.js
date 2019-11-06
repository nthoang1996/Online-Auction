var express = require('express');
var app = express();

app.set('view engine', 'html');
app.use(express.static(__dirname))

//set port
var port = process.env.PORT || 8080;
app.get("/", function(req, res) {
    res.render("home");
});

app.listen(port, function() {
    console.log("app running");
})