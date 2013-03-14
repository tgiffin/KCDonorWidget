/**
 * donor_widget.js
 */
(
  function()
  {
    var locals = {};
    var screen_logic;

    //initialize logic for each screen
    screen_logic = {
      donor_widget_no_auth: 
        function()
        {
          //allow only numbers and decimal point
          
          $("#amount").on("keypress",
            function(evt)
            {
              var ch = String.fromCharCode(evt.charCode);
              if(ch == ".") return;
              if(isNaN(parseInt(ch)))
              {
                evt.preventDefault();
                return false;
              }
            });

          //format the input box for currency
          $("#amount").keyup(
            function()
            {
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
              var new_val = $(this).val();
              var decimal_pos = new_val.indexOf(".");
              if(decimal_pos <=0) return;
              if((new_val.length - decimal_pos - 1) > 2)
              {
                //strip decimals more than 2 places
                $(this).val(new_val.substr(0,new_val.length - 1));
              }
            });
          
        },
      donor_widget_auth:
        function()
        {
        },
      donor_widget_confirm:
        function()
        {
        },
      donor_widget_thank_you:
        function()
        {
        }
    };

    /**
     * Transition to the specified screen
     */
    function show_screen(screen)
    {
      var fragment = screen + ".html";
      $.get("/html/fragments/" + fragment,
        function(data,status,jqXHR)
        {
          var content = Mustache.render(data,locals);
          if($("#content").html()=="")
          {
            $("#content")
            .hide()
            .html(content)
            .fadeIn();

            if(screen_logic[screen]) screen_logic[screen]();

          }
          else
            $("#content").fadeOut(
              function()
              {
                $(this)
                  .html(content)
                  .fadeIn();
              });
          
        });
    }


    /**
     * Main
     */
    $(document).ready(
      function()
      {
        $.getJSON("/charity",
          function(charity, status, jqXHR)
          {
            if(charity && charity.status && charity.status == "ok")
            {
              locals.charity_name = charity.name;

              $.getJSON("/auth",
                function(data,status,jqXHR)
                {
                  if(data.auth)
                  {
                    show_screen("donor_widget_auth");
                  }
                  else
                  {
                    show_screen("donor_widget_no_auth");
                  }
                });
            }
            else
            {
              show_screen("donor_widget_error");
            }

          });
      });


  }
)();
