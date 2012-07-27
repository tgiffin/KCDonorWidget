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
            charity_info.password = $("#password").val();
            charity_info.confirm_password = $("#confirm_password").val();
            if(validate_password())
              $.ajax(
                {
                  url: "/register_charity",
                  type: "POST",
                  data: charity_info,
                  success:
                    function(data)
                    {
                      if(data.Success==true)
                      {
                        charity_info.id = data.id;
                        show_next();
                      }
                      else
                      {
                        $("#error_list").empty().append("<li>Error recevied from Dwolla: " + data.Message + "</li>");
                        $("#validation_errors").popup();
                      }
                    }
                }
              ); //end register charity ajax
            }
        }); //end handle step 2 click

      //handle self-register click
      $("#self_register").on("click",
        function()
        {
          self_register=true;
          $("#auto_register_form").fadeOut();
          $("#dwolla_id_form").fadeIn();
        });
      
      //handle auto-register click
      $("#auto_register").on("click",
        function()
        {
          self_register=false;
          $("#dwolla_id_form").fadeOut();
          $("#auto_register_form").fadeIn();
        });


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
        if(!charity_info.full_name)
          errors.push("Name is a required field");
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
