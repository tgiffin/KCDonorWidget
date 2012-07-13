var mustache = require("mustache"); //templating engine
var console = require("console");
var server = require("./server");
var payment = require("./payment.js");
var fs = require("fs");
var Config = require("./config");
var conf = new Config();

var app = server.app;

/**
 * This is the starting page
 */
exports.donor_widget = function(request, response)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    response.send(mustache.to_html(loadTemplate('donor_widget'),
      {
        charity_id: request.query['charity_id']
      }));

  }

/**
 * Once oauth is complete, we display this page
 */
exports.authenticate_complete = function(request, response)
  {
    var err = request.session.error;
    if(err)
    {
      request.session.error = null;
    }
    request.session.charity_id = request.query['charity_id'];
    response.send(mustache.to_html(loadTemplate('authenticate_complete'),
      {
        charity_id: request.session.charity_id,
        user: request.session.auth.dwolla.user,
        error: err
      }));

  }

/**
 * Confirmation page, gather PIN (for dwolla)
 */
exports.confirm_amount =  function(request, response)
  {
    var result = {};
    //console.log(util.inspect(request));
    var amount = request.session.amount = Number(request.body.amount.replace(/[^0-9\.]+/g,""));
    //validate amount
    if(amount < 10)
    {
      result.status='error',
      result.message='The minimum donation amount is $10. Please enter an amount that is at least $10.'
    }

    if(amount > 5000)
    {
      result.status='error',
      result.message='The maximum amount for a donation is $5,000. Please enter an amount below $5,000.'
    }

    if(result.status=='error')
    {
      request.session.error = result;
      response.redirect(conf.url + "/authenticate_complete.html");
      return;
    }

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

/**
 * This is the main payment API, this is called via ajax request to send money
 */
exports.send_payment = function(request, response)
  {
    var vals = request.body;
    var result = {};

    payment.dwolla.send(
      {
        user_token: request.session.auth.dwolla.accessToken,
        pin: vals.pin,
        destination_id: "812-708-2911",
        amount: request.session.amount,
        success_callback:
          function(result)
          {
            response.json(
              {
                status: "success"
              });
          },
        error_callback:
          function(error)
          {
            response.json(
              {
                status: "error",
                message: error
              });
            //response.end();
          }
      });

  }

/**
 * Thank You page is shown on successful transaction
 */
exports.thank_you = function(request, response)
{
    response.send(mustache.to_html(loadTemplate('thank_you'),
      {
      }));
}



/* Utility functions */

/**
 * Tiny utiltiy function to load a template using the views path
 */
function loadTemplate(template) {
    return fs.readFileSync(app.set('views') + template+ '.html')+ '';
}



