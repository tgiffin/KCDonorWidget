/**
 * register.js
 *
 * Handles the logic for the registration screen.
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
(function($)
{
  $(document).ready(
    function()
    {

      //init google analytics
      var _gaq=[["_setAccount","UA-30533633-1"],['_setDomainName','klearchoice.com'],["_trackPageview"]];
      (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
      g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
      s.parentNode.insertBefore(g,s)}(document,"script"));

      var charity_info = {};
      var existing_account = null;

      //show_next(); 
      //setTimeout(show_next, 1100); //for debugging only

      //init input masks
      $("#dob").mask("99/99/9999",{placeholder:" "});
      $("#zip").mask("99999",{placeholder:" "});
      $("#mailing_zip").mask("99999",{placeholder:" "});
      $("#state").mask("aa",{placeholder:" "});
      $("#mailing_state").mask("aa",{placeholder:" "});
      $("#phone").mask("(999) 999-9999",{placeholder:" "});

      //prevent number input
      $("#first_name, #last_name, #city, #mailing_city").on("keypress",
        function(evt)
        {
          var ch = String.fromCharCode(evt.charCode);
          if(!isNaN(parseInt(ch)))
          {
            evt.preventDefault();
            return false;
          }
        });
      //force number only 
      $("#pin, #confirm_pin").on("keypress",
        function(evt)
        {
          var ch = String.fromCharCode(evt.charCode);
          if(isNaN(parseInt(ch)))
          {
            evt.preventDefault();
            return false;
          }
        });
      //allow numbers or dashes
      $("#dwolla_id").on("keypress",
        function(evt)
        {
          var ch = String.fromCharCode(evt.charCode);
          if(isNaN(parseInt(ch)))
          {
            if(ch=="-") return true;

            evt.preventDefault();
            return false;
          }
        });

      //event handler for next button on step 1
      $("#step1_next").on("click",
        function()
        {
          get_charity_values();
          if(!validate())
            return;

          _gaq.push(["_trackPageView","/step2"]);
          show_next();
        });

      //handle step 2 click, deal with self-register
      $("#register_now").on("click",
        function()
        {
          if(existing_account===null)
          {
            $("#error_list").empty().append("<li>Please select an option, should we create a Dwolla account for you, or do you already have a Dwolla account?</li>");
            $("#validation_errors").popup();
            return;
          }

          $("#register_now").attr("disabled","disabled");
          if(existing_account)
            save_existing_account();
          else
            create_account();
            
        }); //end handle step 2 click

      //handle exisiting dwolla account click
      $("#existing_dwolla_account").on("click",
        function()
        {
          existing_account=true;
          $("#create_account_form").slideUp();
          $("#dwolla_id_form").slideDown();
        });
      
      //handle create_dwolla_account click
      $("#create_dwolla_account").on("click",
        function()
        {
          existing_account=false;
          $("#dwolla_id_form").slideUp();
          $("#create_account_form").slideDown();
        });


      /**
       * Handle an existing Dwolla account. Just save the charity information in our database
       */
      function save_existing_account()
      {
        if(!validate_dwolla_id()) return;

        charity_info.dwolla_id=$("#dwolla_id").val();

        $.ajax(
          {
            url: "/save_charity",
            type: "POST",
            data: charity_info,
            success:
            function(data)
            {
              if(data.success)
              {
                charity_info.id=data.charity_id;
                $("#charity_id").html(charity_info.id);
                _gaq.push(["_trackPageView","/step3"]);
                show_next();
              }
              else
              {
                $("#error_list").empty().append("<li>There was an internal problem saving your information, please try again later</li>");
                $("#validation_errors").popup();
              }
            },
            error:
            function(data)
            {
              $("#error_list").empty().append("<li>There was a problem saving your information, please try again later</li>");
              $("#validation_errors").popup();
            }
          }); //end save_charity ajax call
      }

      /**
       * Handle auto registration
       */
      function create_account()
      {
        var spinner;
        charity_info.password = $("#password").val();
        charity_info.confirm_password = $("#confirm_password").val();
        charity_info.pin = $("#pin").val();
        charity_info.ein = $("#ein").val();
        charity_info.accept_terms = $("#accept_terms").prop("checked");

        if(!validate_step2()) return;

        spinner = new Spinner().spin($("#register_now")[0]);
        $.ajax(
          {
            url: "/register_charity",
            type: "POST",
            data: charity_info,
            success:
            function(data)
            {
              spinner.stop();
              if(data.success)
              {
                charity_info.id = data.charity_id;
                $("#charity_id").html(charity_info.id);
                _gaq.push(["_trackPageView","/step3"]);
                show_next();
              }
              else
              {
                $("#error_list").empty().append("<li>Error recevied from Dwolla: " + data.message + "</li>");
                if(data.errors)
                  data.errors.forEach( function(item) {$("#error_list").append("<li>" + item + "</li>");});
                $("#validation_errors").popup();
              }
            },
            error:
            function()
            {
              spinner.stop();
              $("#error_list").empty().append("<li>Unknown error, please try again later </li>");
              $("#validation_errors").popup();
            }
          }
        ); //end register charity ajax
      }

      /**
       * Various cancelers and closers
       */

      //close the error popup
      $("#close_errors").on("click", function() { $("#validation_errors").closePopup(); });


      /**
       * Show the next item in the wizard
       */
      function show_next()
      {
        TweenMax.to(
          $("#steps"), //target
          1, //duration
          {
            css: { left: "-=1024" },
            ease: Back.easeOut
          });
      }


      /**
       * Validate registration form input
       */
      function validate()
      {
        return $("#registration").valid();
      }

      /**
       * Validate the password to be used on the dwolla account
       */
      function validate_step2()
      {
        var errors = [];
        if(!charity_info.password)
          errors.push("Password is required");
        if(!charity_info.confirm_password)
          errors.push("Confirm password is required");
        if(!(charity_info.password == charity_info.confirm_password))
          errors.push("Passwords must match");
        if(charity_info.password.length < 8)
          errors.push("Password must be at least 8 characters long");

        if(!(/[A-Z]/.test(charity_info.password)))
          errors.push("Password must contain at least one upper case letter");
        if(!(/[a-z]/.test(charity_info.password)))
          errors.push("Password must contain at least one lower case letter");
        if(!(/[0-9]/.test(charity_info.password)))
          errors.push("Password must contain at least one number");

        if(!charity_info.ein)
          errors.push("EIN is a required field");

        if(!charity_info.pin)
          errors.push("PIN is required");
        if(!(charity_info.pin == $("#confirm_pin").val()))
          errors.push("PINs must match");
        if(!(/^[0-9]/.test(charity_info.pin)))
          errors.push("PIN must be numeric digits only");
        if(charity_info.pin.length != 4)
          errors.push("PIN must be 4 numeric digits");

        if(!charity_info.accept_terms)
          errors.push("You must accept the Dwolla Terms of Service to proceed");

        if(!$("#authorized_registrar").prop("checked"))
          errors.push("You must be authorized as the registrar for the church to proceed");


        if(errors.length > 0)
        {
          $("#error_list").empty();
          for(i=0;i<errors.length;i++)
            $("#error_list").append("<li>" + errors[i] + "</li>");

          $("#validation_errors").popup();
          return false;
        }

        return true;
      }

      /**
       * Validate the dwolla ID, ensure it exists and is a valid format
       */
      function validate_dwolla_id()
      {
        var errors = [];
        //for now, we'll just make sure it is there, it has more than 5 chars, and has some dashes in it
        var id = $("#dwolla_id").val();
        if(!id)
          errors.push("Your Dwolla ID is required to continue");
        if(id.length < 5)
          errors.push("Please enter a properly formatted Dwolla ID");
        if(id.indexOf("-") <= 0)
          errors.push("Please enter a properly formatted Dwolla ID, including dashes");

        if(errors.length > 0)
        {
          $("#error_list").empty();
          for(i=0;i<errors.length;i++)
            $("#error_list").append("<li>" + errors[i] + "</li>");

          $("#validation_errors").popup();
          return false;
        }

        return true;
      }

      /**
       * Get the values from the charity registration form and
       * add them to our charity_info object
       */
      function get_charity_values()
      {
        $("#registration_form input").each(
          function()
          {
            if(!$(this).attr("exclude"))
              charity_info[$(this).attr("id")]=$(this).val();
          });
      }

      //all back buttons should be permanently enabled 
      $(".back_button").on('click',
        function()
        {
          TweenMax.to(
            $("#steps"), //target
            1, //duration
            {
              css: { left: "+=1024" },
              ease: Back.easeOut
            });
        });

      
    });
})(jQuery);
