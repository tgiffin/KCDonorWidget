var express = require("express"); //web framework
var everyauth = require("everyauth"); //oath lib
var util = require("util");
var mustache = require("mustache"); //templating engine
var console = require("console");
var fs = require("fs");
var Config = require("./config"); //environment configuration settings
var conf = new Config();

if(!conf.port) { console.log("unable to determine configuration, please check environment variables"); return; }

console.log("Creating server instance...");
if(conf.options)
{
  var app = express.createServer(conf.options);
}
else
{
  var app = express.createServer();
}

/* Config */

//setup everyauth
everyauth.dwolla
  .appId('1JUZIa33HXhhyyDhX3PpT6XDk8vp3B0NtO0lQe7rbxKiOhYTGI')
  .appSecret('pTqTyg6VCVMO6UlgXnarzqndt3mJLDJdJNiI4dLSwDo3rIoi3/')
  .scope('accountinfofull|send')
  .myHostname(conf.hostname)
  .findOrCreateUser(
    function(session,accessToken,accessTokenExtra,dwollaUserMetadata)
    {
      //console.log(util.inspect(dwollaUserMetadata));
      return {id: dwollaUserMetadata.Id, dwolla: dwollaUserMetadata};

    })
  .redirectPath("/authenticate_complete.html");

//set up express
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret:"let's agree to disagree"}));
app.use(everyauth.middleware());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.set("views",__dirname + "/templates/");

/* Request Handlers */
app.get("/test/", function(request, response)
        {
            response.send("hello?");
        });
app.get("/donor_widget.html", function(request, response)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    response.send(mustache.to_html(loadTemplate('donor_widget'),
      {
        charity_id: request.query['charity_id']
      }));

  });
app.get("/authenticate_complete.html", function(request, response)
  {
    response.send(mustache.to_html(loadTemplate('authenticate_complete'),
      {
        charity_id: request.query['charity_id'],
        user: request.session.auth.dwolla.user
      }));

  });
app.post("/confirm_amount", function(request, response)
  {
    //console.log(util.inspect(request));
    var amount = Number(request.body.amount.replace(/[^0-9\.]+/g,""));
    response.send(mustache.to_html(loadTemplate('confirm_amount'),
      {
        amount: amount,
        charity_name: request.query['charity_id'],
        user: request.session.auth.dwolla.user
      }));

  });




console.log("Starting klearchoice server on " + conf.port + "...");
/* Server startup */
app.listen(conf.port);


/* Utility functions */

/**
 * Tiny utiltiy function to load a template using the views path
 */
function loadTemplate(template) {
    return fs.readFileSync(app.set('views') + template+ '.html')+ '';
}

