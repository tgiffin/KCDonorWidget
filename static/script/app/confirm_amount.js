(function($)
{

  $(document).ready(
    function()
    {
      $("#donate_now_button").click(
        function()
        {
          $.ajax(
            {
              url: "/send_payment",
              type: "POST",
              dataType: "json",
              data: {
                      pin: $("#pin").val()
                    },
              success:
                function(data, textStatus, jqXHR)
                {
                  if(data.status=="success")
                  {
                    window.location.href="/thank_you.html";
                  }
                  else
                  {
                    $("#error_message").text(data.message);
                    $("#error_popup").popup();
                  }
                },
              error:
                function(jqXHR, textStatus, errorThrown)
                {
                  alert("There was an error sending payment: " + errorThrown + " please ensure your internet connection is active and try again");
                }

            }); //end ajax call
        }); //end payment button click

        $("#close_popup").click(
          function()
          {
            $("#error_popup").closePopup();
          });

        $("#whats_this_link").click(
          function()
          {
            $("#whats_this_popup").popup();
          });
        $("#close_whats_this").click(
          function()
          {
            $("#whats_this_popup").closePopup();
          });
        
    }); //end document ready

})(jQuery);