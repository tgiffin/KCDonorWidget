var mustache = require("mustache"); //templating engine
var console = require("console");
var server = require("./server");
var payment = require("./payment").dwolla; //payment processor
var dal = require("./dal"); //data access layer
var fs = require("fs");
var Config = require("./config");
var conf = new Config();
var accounting = require("./accounting");

var app = server.app;

/**
 * This is the starting page
 */
exports.donor_widget = function(request, response, next)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    try
    {
      var charity_id = request.session.charity_id = parseInt(escapeHtml(request.query['charity_id']));
    }
    catch(err)
    {
      charity_id=null;
    }
    if(!charity_id)
    {
      response.redirect(conf.hostname + "/invalid_configuration.html");
      return;
    }
    dal.open();
    dal.get_charity(request.session.charity_id,
      function(err,row)
      {
        dal.close();
        if(err) {next(err); return; }

        if(!row)
        {
          response.redirect(conf.hostname + "/invalid_configuration.html");
          return;
        }

        request.session.charity = info = row;

        response.send(mustache.to_html(loadTemplate('donor_widget'),
        {
          charity_id: charity_id
        }));

      });


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
          charity_name: request.session.charity.charity_name,
          user: request.session.auth.dwolla.user,
          error: err.message
        }));
      return;
    }

    if(!request.session.charity)
    {
      next(new Error("Missing charity in session"));
      return;
    }

    dal.open();
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

        response.send(mustache.to_html(loadTemplate('authenticate_complete'),
          {
            charity_name: request.session.charity.charity_name,
            user: request.session.auth.dwolla.user
          }));

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
    /*if(amount < 10)
    {
      result.status='error',
      result.message='The minimum donation amount is $10. Please enter an amount that is at least $10.'
    }*/

    if(amount > 5000)
    {
      result.status='error',
      result.message='The maximum amount for a donation is $5,000. Please enter an amount below $5,000.'
    }

    if(result.status=='error')
    {
      request.session.error = result;
      response.redirect(conf.hostname + "/authenticate_complete.html");
      return;
    }

    var fee = payment.klearchoice_fee + payment.processor_fee;
    var total = request.session.total = amount + fee;
    response.send(mustache.to_html(loadTemplate('confirm_amount'),
      {
        amount: accounting.formatMoney(amount),
        charity_name: request.session.charity.charity_name,
        user: request.session.auth.dwolla.user,
        fee: accounting.formatMoney(fee),
        total: accounting.formatMoney(total)
      }));

  }

/**
 * This is the main payment API, this is called via ajax request to send money
 */
exports.send_payment = function(request, response, next)
  {
    var vals = request.body;
    var result = {};

    payment.send(
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
                donor_id: request.session.donor_id,
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

exports.register = function(request, response)
{
    response.send(mustache.to_html(loadTemplate('register'),
      {
      }));
}

exports.register_charity = function(request, response)
{
  var charity_info = {};

  //dwolla's test environment is non-functional for registration, so we have to simulate a success for testing
  if(conf.env == "development")
  {
     response.json(
            {
              success: true,
              message: "Success",
              charity_id: 123
            });
      return;
  }


  //sanitize
  for(key in request.body) { charity_info[key] = escapeHtml(request.body[key]); }
  payment.register(
    {
      email: charity_info.email,
      password: charity_info.password,
      pin: charity_info.pin,
      firstName: charity_info.first_name,
      lastName: charity_info.last_name,
      address: charity_info.address,
      city: charity_info.city,
      state: charity_info.state,
      zip: charity_info.zip,
      phone: charity_info.phone,
      dateOfBirth: charity_info.dob,
      organization: charity_info.charity_name,
      ein: charity_info.ein,
      acceptTerms: charity_info.accept_terms
    },
    function(err,result)
    {
      if(err)
      {
        response.json(
          {
            success: false,
            message: err.message + " :" + (result ? (result.Message  || "") : ""),
            errors: result.Response
          });
        return;
      }

      //save charity to db
      dal.open();
      dal.save_charity(
        {
          charity_name: charity_info.charity_name,
          address1: charity_info.address,
          address2: '',
          city: charity_info.city,
          state: charity_info.state,
          zip: charity_info.zip,
          dwolla_id: result.Response.Id,
          first_name: charity_info.first_name,
          last_name: charity_info.last_name,
          email: charity_info.email,
          phone: charity_info.phone,
          domain: charity_info.domain,
          dob: charity_info.dob,
          ein: charity_info.ein
        },
        function(err, charity_id)
        {
          dal.close(); 
          if(err)
          {
            response.json(
              {
                success: false,
                message: "Your registration with Dwolla was successfull, but there was an internal problem saving your account information with Klear Choice. We hope to have this issue resolved soon, but until we do, please use the manual registration method and enter your Dwolla ID."
              });

            return;
          }

          response.json(
            {
              success: true,
              message: "Success",
              charity_id: charity_id
          });
      }); //end dal.save_charity()
  }); //end payment.register()
} //end register_charity

exports.save_charity = function(request, response)
{
  var charity_info = {};
  //sanitize
  for(key in request.body) { charity_info[key] = escapeHtml(request.body[key]); }

  //save charity to db
  dal.open();
  dal.save_charity(
    {
      charity_name: charity_info.charity_name,
      address1: charity_info.address,
      address2: '',
      city: charity_info.city,
      state: charity_info.state,
      zip: charity_info.zip,
      dwolla_id: charity_info.dwolla_id,
      first_name: charity_info.first_name,
      last_name: charity_info.last_name,
      email: charity_info.email,
      phone: charity_info.phone,
      domain: charity_info.domain,
      dob: charity_info.dob,
      ein: charity_info.ein
    },
    function(err, charity_id)
    {
      dal.close(); 
      if(err)
      {
        response.json(
          {
            success: false,
            message: "There was an internal problem saving your account information with Klear Choice. We hope to have this issue resolved soon."
          });

        return;
      }

      response.json(
        {
          success: true,
          message: "Success",
          charity_id: charity_id
        });
    }); //end dal.save_charity()
}


/* Utility functions */

/**
 * Tiny utiltiy function to load a template using the views path
 */
function loadTemplate(template) {
    return fs.readFileSync(app.set('views') + template+ '.html')+ '';
}

/** 
 * Utility for scrubbing input, escaping all html to prevent injection/xss
 */
function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}


