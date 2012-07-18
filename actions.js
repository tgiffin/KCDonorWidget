var mustache = require("mustache"); //templating engine
var console = require("console");
var server = require("./server");
var payment = require("./payment"); //payment processor
var dal = require("./dal"); //data access layer
var fs = require("fs");
var Config = require("./config");
var conf = new Config();

var app = server.app;

/**
 * This is the starting page
 */
exports.donor_widget = function(request, response, next)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    var charity_id = request.session.charity_id = request.query['charity_id']
    if(!charity_id)
    {
      next(new Error("Missing charity id"));
      return;
    }

    response.send(mustache.to_html(loadTemplate('donor_widget'),
      {
        charity_id: charity_id
      }));

  }

/**
 * Once oauth is complete, we display this page
 */
exports.authenticate_complete = function(request, response,next) 
  {
    var err = request.session.error;
    if(err)
    {
      request.session.error = null;
      response.send(mustache.to_html(loadTemplate('authenticate_complete'),
        {
          charity_name: info.charity_name,
          user: request.session.auth.dwolla.user,
          error: err
        }));
      return;
    }

    if(!request.session.charity_id)
    {
      next(new Error("Missing charity id in session"));
      return;
    }

    dal.open();
    var info;
    dal.get_donor_id(
      {
        processor_id: request.session.auth.dwolla.user.Id,
        name: request.session.auth.dwolla.user.Name,
        email: '',
        city: request.session.auth.dwolla.user.City,
        state: request.session.auth.dwolla.user.State
      },
      function(err,donor_id)
      {
        if(err) {dal.close(); return next(err); }

        request.session.donor_id=donor_id;

        dal.get_charity(request.session.charity_id,
          function(err,row)
          {
            dal.close();
            if(err) {next(err); return; }

            request.session.charity = info = row;

            response.send(mustache.to_html(loadTemplate('authenticate_complete'),
              {
                charity_name: info.charity_name,
                user: request.session.auth.dwolla.user,
                error: err
              }));
          });
      });

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

    var fee = payment.dwolla.klearchoice_fee + payment.dwolla.processor_fee;
    var total = request.session.total = amount + fee;
    response.send(mustache.to_html(loadTemplate('confirm_amount'),
      {
        amount: amount,
        charity_name: request.session.charity.charity_name,
        user: request.session.auth.dwolla.user,
        fee: fee,
        total: total
      }));

  }

/**
 * This is the main payment API, this is called via ajax request to send money
 */
exports.send_payment = function(request, response, next)
  {
    var vals = request.body;
    var result = {};

    payment.dwolla.send(
      {
        user_token: request.session.auth.dwolla.accessToken,
        pin: vals.pin,
        destination_id: request.session.charity.dwolla_id,
        amount: request.session.total,
        success_callback:
          function(result)
          {
            dal.open();
            dal.log_transaction(
              {
                donor_id: request.session.donor_id,
                charity_id: request.session.charity.id,
                amount: request.session.amount,
                klearchoice_fee: payment.klearchoice_fee, 
                processor_fee: payment.processor_fee,
                confirmation_number: result.Response,
                status: "success",
                message: result.Message
              },
              function(err,result)
              {
                if(err)
                  next(err);
              });
            dal.close();

            response.json(
              {
                status: "success"
              });
          },
        error_callback:
          function(error)
          {
            dal.open();
            dal.log_transaction(
              {
                donor_id: request.session.auth.dwolla.id,
                charity_id: request.session.charity.id,
                amount: request.session.amount,
                klearchoice_fee: payment.klearchoice_fee, 
                processor_fee: payment.processor_fee,
                confirmation_number: '',
                status: "error",
                message: error
              },
              function(err,result)
              {
                if(err)
                  next(err);
              });

            dal.close();

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



