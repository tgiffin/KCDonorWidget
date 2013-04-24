var https = require('https');
var console = require('console');
var util = require('util');
var conf = require("./config")();
var qs = require("querystring");
var log = conf.logger;
var request = require("request");

var klearchoice_fee = .20;
var processor_fee = .25;

/**
 * Utility function for wrapping http requests
 */
function http_request(params, body, callback)
{
  var req = https.request(
      params
    );
    req.on("response", function(response)
    {
      var result='';
      response.on('data', 
        function(chunk) 
        { 
          result += chunk; 
        });
        response.on('end', 
          function() 
          { 
            callback(null,result); 
          });
    });
    req.on("error", function(error)
    {
      console.log("Error in http request!");
      callback(error,null);
    });
    //console.log("path: " + path + " request: " + body);
    log.debug("payment request - path: " + params.path);
    if(body)
      req.write(body);
    req.end();

}

/**
 * Generic http response handler for dwolla api requests
 */
function dwolla_response_handler(err,result,callback)
{
  if(err)
  {
    callback(err,null);
    return;
  }
  var p = {};
  try
  {
    p = JSON.parse(result);
  }
  catch(err)
  {
    log.error("Error parsing server result: " + result);
    p.Success=false;
    p.Message="There was a problem communicating with the payment gateway. Please try again later.";
  }
  console.log(util.inspect(p));

  if(p.Success==false)
  {
    callback(p.Message,null);
    return;
  }

  if(p.Success==true)
  {
    callback(null,p);
    return;
  }

  callback("Unknown response received from payment gateway. Please try again later.",null);
}


exports.dwolla = 
{
  klearchoice_fee: klearchoice_fee,
  processor_fee: processor_fee,
  /**
   * Enumerates the funding sources available to the donor. The callback should be in the form:
   * callback(err,resp) { ... }
   * where resp will be an object containing the Dwolla response.
   * The funding sources will be listed in an array stored in resp.Response.
   * The returned response looks like:
      {
          "Success": true,
          "Message": "Success",
          "Response": [
              {
                  "Id": "c58bb9f7f1d51d5547e1987a2833f4fa",
                  "Name": "Donations Collection Fund - Savings",
                  "Type": "Savings",
                  "Verified": "true",
                  "ProcessingType": "ACH"
              },
              {
                  "Id": "c58bb9f7f1d51d5547e1987a2833f4fb",
                  "Name": "Donations Payout Account - Checking",
                  "Type": "Checking",
                  "Verified": "true",
                  "ProcessingType": "FiSync"
              }
          ]
      }
   * 
   */
  get_funding_sources: function(params,callback)
  {
    var path = conf.dwolla_funding_source_path + "?oauth_token=" + encodeURIComponent(params.user_token);
    http_request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'GET',
        headers: {"Content-Type":"application/json"}
      },
      null, //no body
      function(err,result)
      {
        dwolla_response_handler(err,result,callback);
      });
  },
  /**
   * Checks the balance and calls the specified callback. The callback should be in the form:
   * callback(err,resp) { ... }
   * where resp will be an object containing the Dwolla response.
   * The balance can be obtained via resp.Response
   */
  check_balance: function(params,callback)
  {
    var path = conf.dwolla_balance_path + "?oauth_token=" + encodeURIComponent(params.user_token);
    http_request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'GET',
        headers: {"Content-Type":"application/json"}
      },
      null, //no body
      function(err,result)
      {
        dwolla_response_handler(err,result,callback);
      });
  },
  /**
   * Uses the dwolla guest send API
   *
   * params should look like:
   * {
   *  destination_id: <church dwolla id>,
   *  amount: <amount>,
   *  first_name: <first name>,
   *  last_name: <last name>,
   *  email: <email>,
   *  routing_number: <routing number>,
   *  account_number: <account number>,
   *  account_type: <account type ("Checking" or "Savings")>,
   *  charity_name: <charity name>,
   *  charity_id: <charity id>
   *
   * }
   */
  guest_send: function(params, callback)
  {
    var url = conf.payment_api_url;

    if(conf.prevent_payment_processing)
    {
      callback(null,{Success:true});
      return;
    }

    request(
      {
        url: "https://www.dwolla.com" + conf.dwolla_guest_send_path,
        method: "POST",
        json: {
          client_id: conf.dwolla_app_id,
          client_secret: conf.dwolla_app_secret,
          destinationId: params.destination_id,
          amount: params.amount,
          firstName: params.first_name,
          lastName: params.last_name,
          emailAddress: params.email,
          routingNumber: params.routing_number,
          accountNumber: params.account_number,
          accountType: params.account_type,
          assumeCosts: true,
          destinationType: 'Dwolla',
          notes: "Online Donation to " + params.charity_name,
          groupId: params.charity_id
        }
      },
      //http request callback
      function(err, reponse, body)
      {
        callback(err, body);
      });

  },
  /**
   * Send method, expect params object that contains:
   * sucess_callback,
   * error_callback,
   * pin,
   * destination_id,
   * amount
   *
   * Note: success_callback and error_callback will probably be
   * refactored at some later point to be more standard/nodey - i.e. callback(err, result)
   *
   */
  send: function(params,callback)
  {
    var success_callback = params.success_callback;
    var error_callback = params.error_callback;
    var path = conf.dwolla_path + "?oauth_token=" + encodeURIComponent(params.user_token);

    var body = JSON.stringify(params);
      /*{
        //oauth_token: params.user_token,
        pin: params.pin,
        destinationId: params.destination_id,
        amount: params.amount
        //assumeCosts: true,
        //notes: "Charitable donation facilitated by KlearChoice Inc"
      }*/

    http_request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/json"}
      },
      body,
      function(err,result)
      {
        dwolla_response_handler(err,result,callback);
      });
  },
  /**
   * Register method for Dwolla. Expects charity info with:
   * full_name,
   * charity_name,
   * email,
   * phone,
   * address,
   * city,
   * state,
   * zip
   *
   * and callback of form: callback(err,result) 
   */
  register: function(charity_info, callback)
  {
    var path = conf.dwolla_register_path;
    charity_info.client_id = conf.dwolla_app_id;
    charity_info.client_secret = conf.dwolla_app_secret;
    //path += "?" + qs.stringify({client_id: conf.dwolla_app_id, client_secret: conf.dwolla_app_secret});
    charity_info.type = "NonProfit";

    var body = JSON.stringify(charity_info);
    http_request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/json"}
      },
      body,
      function(err,result)
      {
        dwolla_response_handler(err,result,callback);
      });
  }

}
