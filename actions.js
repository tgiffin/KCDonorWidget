var mustache = require("mustache"); //templating engine
var console = require("console");
var server = require("./server");
var payment = require("./payment").dwolla; //payment processor
var dal = require("./dal"); //data access layer
var fs = require("fs");
var Config = require("./config");
var conf = new Config();
var log = conf.logger;
var accounting = require("./lib/accounting");
var URI = require("./lib/URI/URI");

var app = server.app;

/**
 * This is the starting page
 */
exports.donor_widget = function(request, response, next)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    //var charity_id = request.session.charity_id = parseInt(escapeHtml(request.query['charity_id']));
    var referer = request.headers['referer'];
    var parsedURI = URI.parse(referer);
    log.debug("referer: " + referer + " hostname: " + parsedURI.hostname);
    dal.open();
    dal.get_charity_by_domain(parsedURI.hostname,
      function(err, row)
      {
        dal.close();

        if(err) { next(err); return; }

        if(!row)
        {
          response.redirect(conf.hostname + "/html/donor_widget_invalid_configuration.html");
          return;
        }

        request.session.charity = info = row;

        response.send(mustache.to_html(loadTemplate('donor_widget'),
        {
          charity_name: row.charity_name
        }));
      });

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
        amount: request.session.total
      },
      function(err,result)
      {
        var log_info = 
            {
              donor_id: request.session.donor_id,
              charity_id: request.session.charity.id,
              amount: request.session.amount,
              klearchoice_fee: payment.klearchoice_fee, 
              processor_fee: payment.processor_fee,
              confirmation_number: '',
            };
        if(err)
        {
          log_info.status = "error";
          log_info.message = err;
        }
        else
        {
          log_info.confirmation_number = result.Response;
          log_info.status = "success";
          log_info.message = result.Message;
        }
        dal.open();
        dal.log_transaction(
          log_info,
          function(err,result)
          {
            if(err)
              next(err);
          });
        dal.close();

        if(err)
          response.json(
            {
              status: "error",
              message: error
            });
        else
          response.json(
            {
              status: "success"
            });
      }); //end call payment.send
  };

exports.register = function(request, response)
{
    response.send(mustache.to_html(loadTemplate('register'),
      {
      }));
}

/**
 * API Service calls
 */


/**
 * Return JSON packets that indicated whether the user is currently logged in
 */
exports.is_auth = function(request, response)
{
  if(request.session.auth)
  {
    response.json(
      {
        auth: true
      }
    );
  }
  else
  {
    response.json(
      {
        auth: false
      }
    );
  }
}

/**
 * Authenticate user and store info in auth session variable
 */
exports.auth = function(request, response, next)
{
  var credentials={};
  for(var key in request.body) { credentials[key] = escapeHtml(request.body[key]); }

  dal.open();
  dal.get_donor_auth({email: credentials.email, password: credentials.password},
    function(err, donor)
    {
      dal.close();
      if(err)
      {
        next(err);
        return;
      }

      if(donor)
      {
        request.session.auth = donor;
        response.json(
          {
            auth: true
          });
      }
      else
      {
        request.session.auth = null;
        response.json(
          {
            auth: false
          });
      }

    });
}

/**
 * Lookup donor information based on email address, return JSON formated donor
 */
exports.get_donor = function(request, response)
{
  var donor_email = escapeHtml(request.body["donor_email"]);
  dal.open();
  dal.get_donor({email: donor_email},
    function(err, donor)
    {
      dal.close();
      if(err)
      {
        reponse.json(
          {
            success: false,
            message: "There was a problem retrieving email information, please try again later. If this problem persists, please contact technical support with the following information: " + err.message
          }
        );
        return;
      }

      console.log("donor_id: " + request.session.donor_id);
      request.session.donor=donor;

      response.json(
        {
          success: true,
          message: "",
          new_donor: donor.processor_id ? false : true 
        });
    });
}

/**
 * Retrieve charity information. For now, the only information that is sent is the charity name
 */
exports.get_charity = function(request, response)
{
  
  if(request.session.charity)
    response.json(
      {
        status: "ok",
        name: request.session.charity.charity_name
      });
  else
    response.json(
      {
        status: "error",
        message: "no charity in session"
      });
}

/**
 * Register the charity with Dwolla, then save it to the database
 */
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
          mailing_address1: charity_info.mailing_address,
          mailing_address2: '',
          mailing_city: charity_info.mailing_city,
          mailing_state: charity_info.mailing_state,
          mailing_zip: charity_info.mailing_zip,
          dwolla_id: result.Response.Id,
          first_name: charity_info.first_name,
          last_name: charity_info.last_name,
          title: charity_info.title,
          gender: charity_info.gender,
          board_type: charity_info.board_type,
          email: charity_info.email,
          phone: charity_info.phone,
          domain: URI.parse(charity_info.domain).hostname,
          dob: charity_info.dob,
          ein: '' //not storing ein, for legal purposes 
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

/**
 * Save charity information to the database. 
 *TODO: make this work for updating charity info instead of just inserts
 */
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
      mailing_address1: charity_info.mailing_address,
      mailing_address2: '',
      mailing_city: charity_info.mailing_city,
      mailing_state: charity_info.mailing_state,
      mailing_zip: charity_info.mailing_zip,
      dwolla_id: charity_info.dwolla_id,
      first_name: charity_info.first_name,
      last_name: charity_info.last_name,
      title: charity_info.title,
      gender: charity_info.gender,
      board_type: charity_info.board_type,
      email: charity_info.email,
      phone: charity_info.phone,
      domain: URI.parse(charity_info.domain).hostname,
      dob: charity_info.dob,
      ein: '' //not storing ein, for legal purposes 
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


