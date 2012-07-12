var express = require("express"); //web framework
var redis_store = require("connect-redis")(express);
var everyauth = require("everyauth"); //oath lib
var urllib = require("url"); //for parsing urls
var util = require("util");
var console = require("console");
var Config = require("./config"); //environment configuration settings
var conf = new Config();
var session_store = null;

if(conf.env == "development")
  var session_store = new express.session.MemoryStore();
else if(conf.env == "production")
  var session_store = new redis_store();


if(!conf.port) { console.log("unable to determine configuration, please check environment variables"); return; }

/** 
 * Ensure the user is logged in for any path other than those listed in the exceptions array
 */
function authenticate(request, response, next)
{
  //console.log("authenticate...");
  var exceptions = [
                      '/donor_widget.html',
                      '/test/'
                  ]
  var pathname = urllib.parse(request.url).pathname;
  if(exceptions.indexOf(pathname) >= 0) {next(); return; }

  if(request.session && request.session.auth) { next(); return; }

  response.redirect(conf.hostname + "/donor_widget.html");
  response.end();
}

console.log("Creating server instance...");
if(conf.options)
{
  var app = express.createServer(conf.options);
}
else
{
  var app = express.createServer();
}

exports.app = app;

/* Config */

//setup everyauth
everyauth.dwolla
  .appId(conf.dwolla_app_id)
  .appSecret(conf.dwolla_app_secret)
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
app.use(express.session({store: session_store, secret:"let's agree to disagree about not agreeing"}));
app.use(everyauth.middleware());
app.use(authenticate);
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.set("views",__dirname + "/templates/");

/* Request Handlers */
var routes = require("./routes");
routes.forEach(
  function(item)
  {
    console.log("Registering route: " + item.verb + " - " + item.path + " = " + util.inspect(item.action));
    app[item.verb](item.path,item.action);
  });


console.log("Starting klearchoice server on " + conf.port + "...");
/* Server startup */
app.listen(conf.port);



