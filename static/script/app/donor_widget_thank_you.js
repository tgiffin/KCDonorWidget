(function($)
{

  $("#finish").on("click",
    function()
    {
      parent.postMessage({klearchoice:true, action: "close"},"*");
    });


})(jQuery)
