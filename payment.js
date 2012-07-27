var https = require('https');
var console = require('console');
var util = require('util');
var conf = require("./config")();
var qs = require("querystring");
var log = conf.logger;

exports.dwolla = 
{
  klearchoice_fee: .20,
  processor_fee: .25,
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
  send: function(params)
  {
    var success_callback = params.success_callback;
    var error_callback = params.error_callback;
    var path = conf.dwolla_path + "?oauth_token=" + encodeURIComponent(params.user_token);

    var body = JSON.stringify(
      {
        //oauth_token: params.user_token,
        pin: params.pin,
        destinationId: params.destination_id,
        amount: params.amount
        //assumeCosts: true,
        //notes: "Charitable donation facilitated by KlearChoice Inc"
      });

    var req = https.request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/json"}
      });
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
            handle_result(result); 
          });
      });
    req.on("error", function(error)
      {
        console.log("Error in http request!");
      });
    //console.log("path: " + path + " request: " + body);
    log.debug("payment request - path: " + path + " request: " + body);
    req.write(body);
    req.end();

    function handle_result(result)
    {
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
        if(error_callback) error_callback(p.Message);
        return;
      }

      if(p.Success==true)
      {
        if(success_callback) success_callback(p);
        return;
      }

      if(error_callback) error_callback("Unknown response received from payment gateway. Please try again later.");

    }
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

    var req = https.request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/json"}
      });
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
            handle_result(result); 
          });
      });
    req.on("error", function(error)
      {
        callback(new Error("Error in http request: " + error));
      });
    //console.log("path: " + path + " request: " + body);
    log.debug("payment request - path: " + path + " request: " + body);
    req.write(body);
    req.end();

    function handle_result(result)
    {
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
        callback(new Error("Error registering charity"),p);
        return; 
      }

      if(p.Success==true)
      {
        callback(null,p);
        return;
      }

      callback(new Error("Unknown response received from payment gateway. Please try again later."));

    }
  }

}
