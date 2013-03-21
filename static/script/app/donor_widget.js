/**
 * donor_widget.js
 */
(
  function()
  {
    var locals = {fee:.5};
    var screen_logic;
    
    //for debugging
    locals = {
      amount: 10,
      fee: .5,
      first_name: "Clayton",
      last_name: "Gulick",
      email: "claytongulick@gmail.com",
      confirm_email: "claytongulick@gmail.com",
      account_number: "12345",
      account_type: "Checking",
      routing_number: "121042882",
      create_account: true,
      password: "correcthorsebatterystaple",
      confirm_password: "correcthorsebatterystaple",
      accept_member_terms: true
    };

    //initialize logic for each screen
    screen_logic = {
      donor_widget_no_auth: 
        function()
        {
          //a little initialization, in case this is a edit/back. The other values are loaded from the template
          if(locals.create_account)
          {
            $("#create_account").attr("checked","checked");
            $("#password_wrapper").fadeIn();
            $("#guest_terms").hide();
            $("#member_terms").show();
          }
          if(locals.accept_member_terms)
            $("#accept_member_terms").attr("checked","checked");
          if(locals.accept_guest_terms)
            $("#accept_guest_terms").attr("checked","checked");

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
              if(this.validate && !this.validate()) show_error($(this).attr("id"));
              else clear_error($(this).attr("id"));
            });

          //do the password strength meter
          $("#password").on("keyup",
            function()
            {
              var strength = score_password($(this).val());
              if(strength < 50)
              {
                $("#password_strength").html("Strength: <span style='color:red'>Weak</span> see: <a href='http://xkcd.com/936/' target='_blank'>this</a> for more information on strong passwords.");
              }
              else if(strength < 60)
              {
                $("#password_strength").html("Strength: <span style='color:orange'>Ok</span> see: <a href='http://xkcd.com/936/' target='_blank'>this</a> for more information on strong passwords.");
              }
              else if(strength < 80)
              {
                $("#password_strength").html("Strength: <span style='color:blue'>Good</span> see: <a href='http://xkcd.com/936/' target='_blank'>this</a> for more information on strong passwords.");
              }
              else if(strength >= 80)
              {
                $("#password_strength").html("Strength: <span style='color:green'>Great!</span> see: <a href='http://xkcd.com/936/' target='_blank'>this</a> for more information on strong passwords.");
              }
            });

          //decorator for required values
          function validator(fn)
          {
            return function()
            {
              if(($(this).attr("required") == "required"))
              {
                if(!($(this).val())) return false;
              }

              if(fn)
                return fn.apply(this);

              return true
            }
          }

          //set up validations
          $("#amount")[0].validate = validator(
            function()
            {
              if(isNaN(parseFloat($(this).val().replace("$","")))) return false;
              return true;
            });
          //just basic validator functions for these. Required validation
          $("#first_name, #last_name, #account_number").each(
            function(){
              this.validate = validator();
            });
          $("#email")[0].validate = validator(
            function()
            {
              //very basic email format validation
              return /\S+@\S+\.\S+/.test($("#email").val());
            }
          );
          $("#confirm_email")[0].validate = validator(
            function()
            {
              //validate that the confirmation email matches
              return ($("#email").val() == $("#confirm_email").val());
            }
          );
          $("#routing_number")[0].validate = validator(
            function()
            {
              //validate the routing number
              return check_aba($("#routing_number").val());
            }
          );
          $("#password")[0].validate = validator(
            function()
            {
              if($("#create_account").is(":checked"))
                if(score_password($("#password").val()) < 50) return false;
              return true;
            }
          );

          $("#confirm_password")[0].validate = validator(
            function()
            {
              if($("#create_account").is(":checked"))
                if(!($("#password").val() == $("#confirm_password").val())) return false;
              return true;
            }

          );

          //validate the input
          function validate()
          {
            var valid=true;
            $(".error").removeClass("error");
            $(".validation").hide();

            //validate all fields
            $("input").each(
              function()
              {
                if(this.validate && !this.validate())
                  valid = show_error($(this).attr("id"));
              });

            return valid;
          }

          //calculate the password strength
          function score_password(pass) {
            var score = 0;
            if (!pass)
              return score;

            // award every unique letter until 5 repetitions
            var letters = new Object();
            for (var i=0; i<pass.length; i++) {
              letters[pass[i]] = (letters[pass[i]] || 0) + 1;
              score += 5.0 / letters[pass[i]];
            }

            // bonus points for mixing it up
            var variations = {
              digits: /\d/.test(pass),
              lower: /[a-z]/.test(pass),
              upper: /[A-Z]/.test(pass),
              nonWords: /\W/.test(pass),
            }

            variationCount = 0;
            for (var check in variations) {
              variationCount += (variations[check] == true) ? 1 : 0;
            }
            score += (variationCount - 1) * 10;

            return parseInt(score);
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

          //clear the error display
          function clear_error(id)
          {
            $("#" + id).removeClass("error");
            $("[for='" + id + "']").fadeOut();
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
                get_values();
                show_screen("donor_widget_confirm");
              });

            //handle login click
            $("#login_button").on("click",
              function()
              {
                $.post("auth",
                      {
                        email: $("#login_email").val(),
                        password: $("#login_password").val()
                      },
                      function(data,textStatus,jqXHR)
                      {
                        if(data.auth)
                          return show_screen("donor_widget_auth");
                        $("#login_error").html("Invalid login");
                      }
                  );
              });

          
        },
      donor_widget_auth:
        function()
        {
        },
      donor_widget_confirm:
        function()
        {
          //set the correct amount in the UI and format it
          $("#donation_total_display").html(parseFloat(locals.amount) + locals.fee);
          $("#donation_total_display").formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: 2, eventOnDecimalsEntered: true });
          $("#donation_amount_display").formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: 2, eventOnDecimalsEntered: true });

          //handle back click
          $("#submit_confirm_back").on("click",
            function()
            {
              if(locals.auth)
                show_screen("donor_widget_auth");
              else
                show_screen("donor_widget_no_auth");
            });

          //handle submit click.
          $("#submit_no_auth").on("click",
            function()
            {
              $.post("donate",locals)
                .done(
                  function(data,status,xhr)
                  {
                    if(data.success)
                      return show_screen("donor_widget_thank_you");

                    alert("There was a problem processing your payment: " + data.message);
                  }
                )
                .fail(
                  function(xhr,status,err)
                  {
                    alert("error processing donation, please try again later. Status:" + status + " Error: " + err);
                  });
            });

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
              .fadeIn(
                function()
                {
                  if(screen_logic[screen]) screen_logic[screen]();
                }
              );
          else
            $("#content").fadeOut(
              function()
              {
                $(this)
                  .html(content)
                  .fadeIn(
                    function()
                    {
                      if(screen_logic[screen]) screen_logic[screen]();
                    }
                  );
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
                    locals.auth=true;
                    show_screen("donor_widget_auth");
                  }
                  else
                  {
                    locals.auth = null;
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
