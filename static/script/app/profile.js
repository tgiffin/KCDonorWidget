/**
 * profile.js
 *
 * Handles the logic for the profile screen.
 *
 * Good developers view source!
 * For any questions please contact the author: clay@ratiosoftware.com
 *
 * History
 * 
 * Date         Author                                 Comment
 * ----------------------------------------------------------------------
 * 4/18/2013    Clay Gulick (clay@ratiosoftware.com)   Initial version created
 * 
 */
(
  function()
  {
    var locals = {fee:.5};
    var screen_logic;
    var current_screen;

    //init google analytics
    var _gaq=[["_setAccount","UA-30533633-1"],['_setDomainName','klearchoice.com']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
      g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
        s.parentNode.insertBefore(g,s)}(document,"script"));

    //initialize logic for each screen
    screen_logic = {

      /**
       * Login screen logic
       */
      profile_login: 
        function()
        {
          _gaq.push(["_trackPageview","/profile/login"]);

          window.RecaptchaOptions = {
            theme : 'theme_name'
          };

          var login_attempts=0;
          var password_recovery_attemps=0;

          //custom inline validation function for login form
          function validate_login()
          {
            var valid=true;
            $("#login_form .error").removeClass("error");
            $("#login_form .validation").hide();

            //validate all fields
            $("#login_form input").each(
              function()
              {
                if(this.validate && !this.validate())
                  valid = show_error($(this).attr("id"));
              });

              return valid;
          }

          //revalidate each time a form item loses focus
          $("input").on("blur",
            function()
            {
              if(this.validate && !this.validate()) show_error($(this).attr("id"));
              else clear_error($(this).attr("id"));
            });


          //set up validations
          $("#username")[0].validate = validator(
            function()
            {
              //very basic email format validation
              return /\S+@\S+\.\S+/.test($("#username").val());
            }
          );
          $("#email")[0].validate = validator(
            function()
            {
              //very basic email format validation
              return /\S+@\S+\.\S+/.test($("#email").val());
            }
          );
          $("#password")[0].validate = validator();
          var recaptcha_required=false;

          //handle login click
          $("#submit_login").on("click",
            function()
            {
              if(!validate_login())
                return;

              $.post("auth",
                {
                  email: $("#username").val(),
                  password: $("#password").val(),
                  recaptcha_challenge_field: recaptcha_required ? Recaptcha.get_challenge() : null,
                  recaptcha_response_field: recaptcha_required ? Recaptcha.get_response() : null,
                },
                function(data,textStatus,jqXHR)
                {
                  if(data.auth)
                  {
                    locals = $.extend(locals,data);
                    $(".process").fadeIn(); //show navbar
                    current_screen = $.History.getHash();
                    current_screen = current_screen.replace("/","");
                    if(current_screen == "") current_screen = "profile_information";
                    return show_screen(current_screen);
                  }
                  $("#login_error").html("Invalid login");
                  if(data.require_captcha)
                  {
                    recaptcha_required=true;
                    Recaptcha.create(
                      recaptcha_public_key, //this is global in the profile.html page, comes from the server config
                      $("#login_recaptcha")[0],
                      {
                        theme: "clean",
                        callback: Recaptcha.focus_response_field
                      });
                  }
                }
              );
            }); //end submit login click

            //handle password recovery click
            $("#submit_password_recovery").on("click",
              function()
              {
                if(!$("#email")[0].validate())
                {
                  show_error("email");
                  return;
                }
                $.post("/recover_password",
                {
                  email: $("#email").val()
                },
                function(data,textStatus,jqXHR)
                {
                  if(data.success)
                  {
                    $("#recovery_message").html("An email has been sent with a link for you to use to reset your password.");
                  }
                  else
                  {
                    $("#recovery_message").html(data.message);
                  }
                }); //end post

              }); //end submit password recovery click
        },

      /**
       * Logic for the profile information screen
       */
      profile_information:
        function()
        {
          _gaq.push(["_trackPageview","/profile/profile_information"]);

          //set up validators
          $("#password")[0].validate = validator();
          $("#confirm_password")[0].validate = validator(
            function()
            {
              return $("#password").val() == $("#confirm_password").val();
            }
          );

          $("#email")[0].validate = validator(
            function()
            {
              //very basic email format validation
              return /\S+@\S+\.\S+/.test($("#email").val());
            }
          );

          
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

            //revalidate each time a form item loses focus
            $("input").on("blur",
              function()
              {
                if(this.validate && !this.validate()) show_error($(this).attr("id"));
                else clear_error($(this).attr("id"));
              });

            //set up handlers for button clicks
            $("#change_email").on("click",
              function()
              {
                $("#change_email_form").fadeIn();
              });
            $("#cancel_change_email").on("click",
              function()
              {
                $("#change_email_form").fadeOut();
              });

            $("#change_password").on("click",
              function()
              {
                $("#change_password_form").fadeIn();
              });
            $("#cancel_change").on("click",
              function()
              {
                $("#change_password_form").fadeOut();
              });

            //handle email submit click
            $("#submit_change_email").on("click",
              function()
              {
                if(!validate($("#email"))) return;

                $.post("/set_email",{ email: $("#email").val() })
                .done(
                  function(data, textStatus, jqXHR)
                  {
                    if(!data.success) return alert(data.message);
                    $("#email_display").html($("#email").val());
                    $("#change_email_form").fadeOut();
                  })
                .fail(
                  function(xhr,status,err) { alert(err); });
                  
              });

            //handle submit click
            $("#submit_change").on("click",
              function()
              {
                if(!validate($("#password, #confirm_password"))) return;

                $.post("/set_password",{ password: $("#password").val() })
                .done(function(data,textStatus, jqXHR)
                {
                  if(!data.success)
                  {
                    $("#error_message").text(data.message);
                    $("#reset_error").fadeIn();
                    return;
                  }

                  $("#login_form").fadeOut();
                  $("#reset_success").fadeIn();
                })
                .fail(function(xhr,status,err)
                {
                  alert(err);
                });

              });
        },
      /**
       * Logic for the recurring donations screen
       */
      profile_recurring_donations:
        function()
        {
          _gaq.push(["_trackPageview","/profile/recurring_donations"]);

          //get the widget markup and the subscription data
          $.when(
              $.get("/html/fragments/profile_recurring_donation_widget.html"), //get the markup template
              $.get("/subscriptions")) //get the data
            .done(
              function(fragment, response)
              {
                fragment = fragment[0]; response = response[0];

                if(!response.success)
                  return alert("Error retrieving recurring donations, please try again later.");

                if(response.subscriptions.length == 0)
                  $("#subscriptions").html("<b>No active recurring donations.</b>");
                else
                  response.subscriptions.forEach(
                    function(subscription)
                    {
                      subscription.last_transaction_date = subscription.last_transaction_date ? date_local(subscription.last_transaction_date).toLocaleDateString() : "None";
                      subscription.next_transaction_date = date_local(subscription.next_transaction_date).toLocaleDateString();
                      subscription.subscription_id = subscription.id;
                      var $frag = $(Mustache.render(fragment,subscription));
                      $frag.find("[field=amount]").formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: 2});
                      $("#subscriptions").append($frag);
                    });
                
              })
            .fail(
              function()
              {
                  return alert("Error retrieving recurring donations, please try again later.");
              });

          //handle cancel subscription click using delegated event
          $("#subscriptions").on("click",".cancel_subscription",
            function()
            {
              var subscription_id = $(this).attr("subscription_id");
 
              $.post("/subscription/cancel",
              {
                subscription_id: subscription_id
              })
              .done(
                function(result)
                {
                  if(!result.success)
                  {
                    return alert("Failed to cancel subscription. If this problem persists, please contact technical support");
                  }
                  //mark this row as canceled
                  $(".recurring_donation_widget[subscription_id=" + subscription_id + "] > [field=next_transaction_date]")
                    .html("canceled");

                  //remove the cancel button
                  $(".recurring_donation_widget[subscription_id=" + subscription_id + "] > button").remove();
                })
              .fail(
                function()
                {
                  alert("Failed to cancel subscription. If this problem persists, please contact technical support");
                });
            });

        },
      /**
       * Logic for the donation history screen
       */
      profile_donation_history:
        function()
        {
          _gaq.push(["_trackPageview","/profile/donation_history"]);
          $.get("/donation_history")
            .done(
              function(result)
              {
                if(!result.success)
                  return alert("Unable to retrieve donation history. Please try again later.");
                if(result.rows.length == 0)
                  return $("#donation_history_display").html("<b>No transactions found.</b>");

                result.rows.forEach(
                  function(row)
                  {
                    $("#donation_history_table_body").append(
                      "<tr>" + 
                        "<td>" + (new Date(row.create_date)).toLocaleDateString() + "</td>" +
                        "<td>" + row.charity_name + "</td>" + 
                        "<td class='currency'>" + row.amount + "</td>" + 
                        "<td>" + row.transaction_id + "</td>" + 
                        "<td>" + row.status + "</td>" + 
                      "</tr>"
                      );
                  });
                $(".currency").formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: 2});
              })
            .fail(
              function()
              {
                return alert("Unable to retrieve donation history. Please try again later.");
              });
        }
    };

    /*********************** Utility Functions **********************/

    /**
     * calculate the password strength
     */
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


    /**
     * Basic char code filtering for numeric and decimal
     */
    function filter_amount(evt)
    {
      var ch = String.fromCharCode(evt.charCode);
      if(ch == ".") return;
      if(isNaN(parseInt(ch)))
      {
        evt.preventDefault();
        return false;
      }
    }

    /**
     * validate the routing number according to ABA standard
     */
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

    /**
     * Handle keyboard filtering and currency formatting for the amount text boxes
     */
    function format_amount(e)
    {
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
    }

    /**
     * Utility function for wrapping validators. Handles required fields
     */
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

    /**
     * Validate the inputs on the currently active screen
     */
    function validate($eles)
    {
      var valid=true;
      $(".error").removeClass("error");
      $(".validation").hide();

      var $validation_elements = $eles || $("input");

      //validate all fields
      $validation_elements.each(
        function()
        {
          if(this.validate && !this.validate())
            valid = show_error($(this).attr("id"));
        });

        return valid;
    }

    /**
     * Change the class and show the error tooltip
     */
    function show_error(id)
    {
      $("#" + id).addClass("error");
      $("[for='" + id + "']").css("display","inline-block");
      return false; //this is just to save curly brackets typing
    }

    /**
     * Clear the error display
     */
    function clear_error(id)
    {
      $("#" + id).removeClass("error");
      $("[for='" + id + "']").fadeOut();
    }

    /**
     * Transition to the specified screen
     */
    function show_screen(screen)
    {
      if(!locals.auth) screen = "profile_login";
      var fragment = screen + ".html";
      $.get("/html/fragments/" + fragment,
        function(data,status,jqXHR)
        {
          var content = Mustache.render(data,locals);
          if($("#content").html()=="")
          {
            $("#content").html(content);
            if(screen_logic[screen]) screen_logic[screen]();
          }
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
     * Initiallize the history plugin to support browser back buttons
     */
    function init_history()
    {
      $.History.bind(function(state)
      {
        var prev;
        state = state.replace("/","");
        if(state == "") state="profile_information";
        show_screen(state);
        current_screen = state;
      });
    }

    /**
     * Set up event handlers to deal with user navigation between screens
     */
    function init_navigation()
    {
      $(".process").on("click",
        function()
        {
        });
    }

    /**
     * Takes a date in UTC format and returns it as local date, without the 
     * subtraction for timezone
     */
    function date_local(utc_string)
    {
      var d = utc_string.split("T")[0].split("-");
      return new Date(d[0],d[1]-1,d[2]);
    }


    /**
     * Main
     */
    $(document).ready(
      function()
      {

        init_navigation();
        current_screen = $.History.getHash();
        current_screen = current_screen.replace("/","");

        $.getJSON("/auth",
          function(data,status,jqXHR)
          {
            if(data.auth)
            {
              locals = $.extend(locals,data);
              $(".process").fadeIn();
              if(current_screen == "")
              {
                current_screen = "profile_information";
                show_screen(current_screen);
              }
            }
            else
            {
              locals.auth = null;
              if(current_screen == "")
              {
                show_screen("profile_login");
              }
            }
            init_history();
          });
      });

  }
)();
