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
    $(document).ready(init);

    /**
     * Set up handlers and initialize the screen
     */
    function init()
    {
      //init google analytics
      var _gaq=[["_setAccount","UA-30533633-1"],['_setDomainName','klearchoice.com'],["_trackPageview","/reset_password"]];
      (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
      g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
      s.parentNode.insertBefore(g,s)}(document,"script"));

      //set up validators
      $("#password")[0].validate = validator();
      $("#confirm_password")[0].validate = validator(
        function()
        {
          return $("#password").val() == $("#confirm_password").val();
        }
      );

      //do the password strength meter
      $("#password").on("keyup",
        function()
        {
          var strength = score_password($(this).val());
          if(strength < 50)
          {
            $("#password_strength").html("Strength: <span style='color:red'>Weak</span>");
          }
          else if(strength < 60)
          {
            $("#password_strength").html("Strength: <span style='color:orange'>Ok</span>");
          }
          else if(strength < 80)
          {
            $("#password_strength").html("Strength: <span style='color:blue'>Good</span>");
          }
          else if(strength >= 80)
          {
            $("#password_strength").html("Strength: <span style='color:green'>Great!</span>");
          }
        });

      //revalidate each time a form item loses focus
      $("input").on("blur",
        function()
        {
          if(this.validate && !this.validate()) show_error($(this).attr("id"));
          else clear_error($(this).attr("id"));
        });

      //handle submit click
      $("#submit_reset").on("click",
        function()
        {
          if(!validate()) return;

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

    }

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
