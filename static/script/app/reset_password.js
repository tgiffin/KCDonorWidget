/**
 * reset_password.js
 *
 * Handles the logic for the password reset screen.
 *
 * Good developers view source!
 * For any questions please contact the author: clay@ratiosoftware.com
 *
 * History
 * 
 * Date         Author                                 Comment
 * ----------------------------------------------------------------------
 * 5/04/2013    Clay Gulick (clay@ratiosoftware.com)   Initial version created
 * 
 */

(
  function()
  {
    $(document).ready(init());

    //set up validators
    $("#password")[0].validate = validator();
    $("#confirm_password")[0].validate = validator(
      function()
      {
        return $("#password").val() == $("#confirm_password").val();
      }
    );

    //revalidate each time a form item loses focus
    $("input").on("blur",
      function()
      {
        if(this.validate && !this.validate()) show_error($(this).attr("id"));
        else clear_error($(this).attr("id"));
      });

    /**
     * Set up handlers and initialize the screen
     */
    function init()
    {
      $("#submit_reset").on("click",
        function()
        {
          if(!validate()) return;

          $.post(
            {
              url: "/reset_password",
              data: {
                password: $("#password").val()
              },
            },
            function(data,textStatus, jqXHR)
            {
              if(!data.success)
              {
                $("#error_message").text(data.message);
              }
            }
            );

        });

    }

    /**
     * Validate the inputs on the currently active screen
     */
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
  }
)();
