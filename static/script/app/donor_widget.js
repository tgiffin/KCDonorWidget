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
          //gather all the input values
          function get_values()
          {
            $("input").each(
              function()
              {
                var $ele = $(this);
                locals[$ele.attr("id")]=$ele.val();
              });
              locals.create_account = $("#create_account").is(":checked");
              locals.accept_guest_terms = $("#accept_guest_terms").is(":checked");
              locals.accept_member_terms = $("#accept_member_terms").is(":checked");
              locals.account_type = $("#account_type").val();
          }

          //revalidate each time a form item loses focus
          $("#donation_form input").on("blur",
            function()
            {
              validate();
            });

          //validate the input
          function validate()
          {
            var valid=true;
            $(".error").removeClass("error");
            $(".validation").hide();

            //validate all required fields
            $("[required='true']").each(
              function()
              {
                if(!$(this).val()) valid = show_error($(this).attr("id")); //show error always returns false. Just using this as a shortcut to avoid lots of if{....} blocks
              });

            //very basic email format validation
            var re = /\S+@\S+\.\S+/;
            if(!re.test($("#email").val())) valid = show_error("email");

            //validate that the confirmation email matches
            if(!($("#email").val() == $("#confirm_email").val())) valid = show_error("confirm_email");

            //validate the routing number
            if(!check_aba($("#routing_number").val())) valid = show_error("routing_number");

            if(!valid) return;

            

          }

          //validate the routing number according to ABA standard
          function check_aba(s) {

            var i, n, t;

            // First, remove any non-numeric characters.

            t = "";
            for (i = 0; i < s.length; i++) {
              c = parseInt(s.charAt(i), 10);
              if (c >= 0 && c <= 9)
                t = t + c;
            }

            // Check the length, it should be nine digits.

            if (t.length != 9)
              return false;

            // Now run through each digit and calculate the total.

            n = 0;
            for (i = 0; i < t.length; i += 3) {
              n += parseInt(t.charAt(i),     10) * 3
              +  parseInt(t.charAt(i + 1), 10) * 7
              +  parseInt(t.charAt(i + 2), 10);
            }

            // If the resulting sum is an even multiple of ten (but not zero),
            // the aba routing number is good.

            if (n != 0 && n % 10 == 0)
              return true;
            else
              return false;
          }

          //change the class and show the error tooltip
          function show_error(id)
          {
            $("#" + id).addClass("error");
            $("[for='" + id + "']").css("display","inline-block");
            return false; //this is just to save curly brackets typing
          }

          //show check help dialog when help button is clicked
          $(".help_button").on("click",
            function()
            {
              var id = $(this).attr("id");
              var img = ((id == "account_number_help_button") ? "check_help_account.png" : "check_help_routing.png");
              $("#check_help_img").attr("src","/images/" + img);
              $("#check_help").dialog(
                {
                  width: 500
                });


            });

          //listen for "show" message and hook up html5 placeholder shim
          //I curse IE. It caused these shenanigans.
          $(window).on("message",
            function(evt)
            {
              var data = evt.originalEvent.data;
              if(data == "show")
              {
                //html5 placeholder shim for IE
                jQuery.placeholder.shim();
              }
            });

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

            //handle create account click
            $("#create_account").on("click",
              function()
              {
                if($(this).is(":checked"))
                {
                  $("#password_wrapper").fadeIn();
                  $("#member_terms").show();
                  $("#guest_terms").hide();
                }
                else
                {
                  $("#password_wrapper").fadeOut();
                  $("#member_terms").hide();
                  $("#guest_terms").show();
                }
              });

            //handle submit click
            $("#submit_no_auth").on("click",
              function()
              {
                if(!validate())
                  return;
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
            $("#content")
              .hide()
              .html(content)
              .fadeIn();
          else
            $("#content").fadeOut(
              function()
              {
                $(this)
                  .html(content)
                  .fadeIn();
              });

          if(screen_logic[screen]) screen_logic[screen]();
          
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
