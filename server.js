var express = require("express");
var console = require("console");
console.log("Starting klearchoice server...");
var app = express.createServer();

app.use(express.static(__dirname + '/static'));

app.get("/test/", function(request, response)
        {
            response.send("hello?");
        });

app.listen(3000);
