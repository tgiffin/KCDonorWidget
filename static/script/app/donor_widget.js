/**
 * donor_widget.js
 *
 * First screen of the donor flow
 */
(
  function()
  {

    //handle email button click
    $("#submit_email").on("click",
      function()
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
        
      }); //end email button click

    //handle new user click
    $("#new_dwolla_button").on("click",
      function()
      {
        window.location.href="/html/new_dwolla_user.html";
      });

    //handle existing dwolla user click
    $("#existing_dwolla_button").on("click",
      function()
      {
        window.location.href="/auth/dwolla";
      });


  }
)();
