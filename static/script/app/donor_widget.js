/**
 * donor_widget.js
 *
 * First screen of the donor flow
 */
(
  function()
  {

    //called when submit button is clicked, or enter key is pressed
    function handle_submit_email()
    {
      $.ajax(
        {
          url: '/get_donor',
          type: 'POST',
          data: {
            donor_email: $("#donor_email").val()
          },
          success: 
          function(data,text_status,xhr)
          {
            if(!data.success)
            {
              alert("There was an error checking your account: " + data.message);
              return;
            }
            if(data.new_donor)
            {
              $("#email_wrapper").fadeOut(
                function()
                {
                  $("#new_donor").fadeIn();
                }
              );
            }
            else
            {
              window.location.href='/auth/dwolla';
            }
          },
          error:
          function(xhr,text_status,error_thrown)
          {
            alert("There was an error processing your request: " + error_thrown);
          }
        }
      ); //end ajax
    }

    //handle email button click
    $("#submit_email").on("click", handle_submit_email);
    //handle enter key
    $("#donor_email").on("keydown", 
      function(e) { if(e.which==13) handle_submit_email(); });

    //handle new user click
    $("#new_dwolla_button").on("click",
      function()
      {
        window.location.href="/html/donor_widget_new_dwolla_user.html";
      });

    //handle existing dwolla user click
    $("#existing_dwolla_button").on("click",
      function()
      {
        window.location.href="/donor_widget_amount.html";
      });


  }
)();
