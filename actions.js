var mustache = require("mustache"); //templating engine
var console = require("console");
var server = require("./server");
var fs = require("fs");

var app = server.app;

exports.donor_widget = function(request, response)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    response.send(mustache.to_html(loadTemplate('donor_widget'),
      {
        charity_id: request.query['charity_id']
      }));

  }

exports.authenticate_complete = function(request, response)
  {
    request.session.charity_id = request.query['charity_id'];
    response.send(mustache.to_html(loadTemplate('authenticate_complete'),
      {
        charity_id: request.session.charity_id,
        user: request.session.auth.dwolla.user
      }));

  }

exports.confirm_amount =  function(request, response)
  {
    //console.log(util.inspect(request));
    var amount = Number(request.body.amount.replace(/[^0-9\.]+/g,""));
    var fee = .45;
    var total = amount + fee;
    response.send(mustache.to_html(loadTemplate('confirm_amount'),
      {
        amount: amount,
        charity_name: request.session.charity_id,
        user: request.session.auth.dwolla.user,
        fee: fee,
        total: total
      }));

  }

/* Utility functions */

/**
 * Tiny utiltiy function to load a template using the views path
 */
function loadTemplate(template) {
    return fs.readFileSync(app.set('views') + template+ '.html')+ '';
}



