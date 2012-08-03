(function($)
{
  $(document).ready(
    function()
    {

      var charity_info = {};
      var self_register = null;

      //event handler for next button on step 1
      $("#step1_next").on("click",
        function()
        {
          get_charity_values();
          if(!validate())
            return;

          show_next();
        });

      //handle step 2 click
      $("#step2_next").on("click",
        function()
        {
          if(self_register===null)
          {
            $("#error_list").empty().append("<li>Please select whether you'd like us to register your account for you.</li>");
            $("#validation_errors").popup();
            return;
          }
          if(self_register)
          {
            if(validate_dwolla_id())
              $.ajax(
                {
                  url: "/save_charity",
                  type: "POST",
                  data: charity_info,
                  success:
                    function(data)
                    {
                      charity_info.id=data.id;
                      show_next();
                    }
                });

          }
          else
          {
            }
        }); //end handle step 2 click

      //handle self-register click
      $("#self_register").on("click",
        function()
        {
          self_register=true;
          $("#auto_register_form").fadeOut();
          $("#dwolla_id_form").fadeIn();
          $("#self_register_popup").popup();
        });
      
      //handle auto-register click
      $("#auto_register").on("click",
        function()
        {
          self_register=false;
          $("#dwolla_id_form").fadeOut();
          $("#auto_register_form").popup();
        });

      /**
       * Handle auto registration
       */
      $("#register_now").on("click",
        function()
        {
          var spinner;
          charity_info.password = $("#password").val();
          charity_info.confirm_password = $("#confirm_password").val();
          charity_info.pin = $("#pin").val();
          charity_info.accept_terms = $("#accept_terms").prop("checked");

          if(validate_password())
          {
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
                      charity_info.id = data.id;
                      $("#auto_register_form").closePopup();
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
            } //end if validate
        });

      /**
       * Various cancelers and closers
       */

      //close the error popup
      $("#close_errors").on("click", function() { $("#validation_errors").closePopup(); });

      //close the auto register popup
      $("#cancel_register").on("click",function() { $("#auto_register_form").closePopup(); });

      //close the self register popup
      $("#cancel_open_dwolla_registration").on("click",function() { $("#self_register_popup").closePopup(); });


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
            ease: Bounce.easeOut
          });
      }


      /**
       * Validate registration form input
       */
      function validate()
      {
        var errors = [];
        var i=0;
        if(!charity_info.first_name)
          errors.push("First name is a required field");
        if(!charity_info.last_name)
          errors.push("Last name is a required field");
        if(!charity_info.charity_name)
          errors.push("Charity name is required");
        if(!charity_info.email)
          errors.push("Email is a required field");
        if(!charity_info.phone)
          errors.push("Phone is a required field");
        if(!charity_info.address)
          errors.push("Address is a required field");
        if(!charity_info.city)
          errors.push("City is a required field");
        if(!charity_info.state)
          errors.push("State is a required field");
        if(!charity_info.zip)
          errors.push("Zip is a required field");
        if(!charity_info.ein)
          errors.push("EIN is a required field");
        if(!charity_info.dob)
          errors.push("Birth date is a required field");

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
       * Validate the password to be used on the dwolla account
       */
      function validate_password()
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

        if(!charity_info.pin)
          errors.push("Pin is required");
        if(!(/^[0-9]/.test(charity_info.pin)))
          errors.push("Pin must be numeric digits only");
        if(charity_info.pin.length != 4)
          errors.push("Pin must be 4 numeric digits");

        if(!charity_info.accept_terms)
          errors.push("You must accept the Dwolla Terms of Service to proceed");


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
              ease: Bounce.easeOut
            });
        });

      
    });
})(jQuery);
