/** 
 *
 * authorization_complete.js
 *
 * This file implements logic for the autorization_complete.html page. 
 *
 * Authorization_complete.html is loaded after the user is authenticated and is ready to enter a donation amount.
 *
 * The donation amount is currency-formatted, and submitted to the server for interaction with the payment processor.
 *
 * The submit occurs via standard http POST, after which the user is redirected to thank_you.html
 *
 * Written for KlearChoice, Inc
 * Written by Clayton C. Gulick (http://ratiosoftware.com)
 *
 * Copyright 2012
 */


(function($)
{

  //validate and submit form
  $("#donate_button").click(
    function()
    {
      $("#donate_form").submit();
      return false;
    });

  //close popup
  $("#cancel_button").click(
    function()
    {
      parent.postMessage({klearchoice: true, action: "close"},"*");
    });

  //format the input box for currency
  $("#amount").keyup(
    function()
    {
      var $input = $(this);
      $input
        .keyup(function(e) {
                var e = window.event || e;
                var keyUnicode = e.charCode || e.keyCode;
                if (e !== undefined) {
                  switch (keyUnicode) {
                    case 16: break; // Shift
                    case 17: break; // Ctrl
                    case 18: break; // Alt
                    case 27: this.value = ''; break; // Esc: clear entry
                    case 35: break; // End
                    case 36: break; // Home
                    case 37: break; // cursor left
                    case 38: break; // cursor up
                    case 39: break; // cursor right
                    case 40: break; // cursor down
                    case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                    case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                    case 190: break; // .
                    default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
                  }
                }
              });
        var new_val = $input.val();
        var decimal_pos = new_val.indexOf(".");
        if(decimal_pos <=0) return;
        if((new_val.length - decimal_pos - 1) > 2)
        {
          //strip decimals more than 2 places
          $input.val(new_val.substr(0,new_val.length - 1));
        }
    });

})(jQuery);
